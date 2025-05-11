/* eslint-disable @typescript-eslint/no-require-imports */
const { ethers } = require('ethers');
const { Pool } = require('pg');

// Database configuration
const dbPool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'postgres',
  password: 'password',
  port: 5432,
});

// Lisk Testnet provider
const provider = new ethers.JsonRpcProvider('https://rpc.sepolia-api.lisk.com');

// Contract ABIs
const factoryABI = [
  "event HiveCoreCreated(address indexed hiveCoreAddress, address indexed baseToken, address indexed quoteToken)",
  "event QuoteTokenAdded(address indexed quoteToken)",
  "function getHiveCoreCount() view returns (uint256)",
  "function getHiveCoreByIndex(uint256 index) view returns (address)",
  "function getAllHiveCores() view returns (address[] memory)"
];

const coreABI = [
  "event OrderCreated(address indexed trader, uint256 price, uint256 amount, uint8 orderType)",
  "event OrderCancelled(uint256 indexed orderId)",
  "event OrderUpdated(uint256 indexed orderId, uint256 newAmount)",
  "event TradeExecuted(address indexed buyer, address indexed seller, uint256 tradeAmount, uint256 price)"
];

// Contract addresses
const factoryAddress = "0x6B063FC60EF73a94BA2239267da841574F8309b2"; // Your factory contract address
const factoryContract = new ethers.Contract(factoryAddress, factoryABI, provider);

// Track known pools
let knownPools = new Set();

// Initialize by loading existing pools from DB
async function initializeKnownPools() {
  try {
    const res = await dbPool.query('SELECT address FROM pools');
    res.rows.forEach(row => knownPools.add(row.address));
    console.log(`Loaded ${knownPools.size} existing pools from database`);
  } catch (err) {
    console.error('Error loading pools from database:', err);
  }
}

// Process a single block
async function processBlock(blockNumber) {
  console.log(`Processing block ${blockNumber}`);
  
  try {
    const block = await provider.getBlock(blockNumber);

    console.log(`Block timestamp: ${new Date(block.timestamp * 1000).toISOString()}`);
    
    // Phase 1: Check for new pools from factory
    await checkFactoryEvents(blockNumber);
    
    // Phase 2: Process all known pools for trade events
    await processAllPools(blockNumber);
    
  } catch (error) {
    console.error(`Error processing block ${blockNumber}:`, error);
  }
}

// Check factory for new pool creations
async function checkFactoryEvents(blockNumber) {
  try {
    const filter = factoryContract.filters.HiveCoreCreated();
    const events = await factoryContract.queryFilter(filter, blockNumber, blockNumber);
    
    for (const event of events) {
      const poolAddress = event.args.hiveCoreAddress;
      
      if (!knownPools.has(poolAddress)) {
        knownPools.add(poolAddress);
        
        // Store new pool in database
        await dbPool.query(
          'INSERT INTO pools(address, base_token, quote_token, created_at) VALUES($1, $2, $3, $4)',
          [poolAddress, event.args.baseToken, event.args.quoteToken, new Date()]
        );
        
        console.log(`New pool detected: ${poolAddress}`);
      }
    }
  } catch (error) {
    console.error('Error checking factory events:', error);
  }
}

// Process all known pools for trade events
async function processAllPools(blockNumber) {
  for (const poolAddress of knownPools) {
    await processPoolEvents(poolAddress, blockNumber);
  }
}

// Process events from a single pool
async function processPoolEvents(poolAddress, blockNumber) {
  try {
    const poolContract = new ethers.Contract(poolAddress, coreABI, provider);
    
    // Process all event types
    await processEventType(poolContract, 'OrderCreated', blockNumber);
    await processEventType(poolContract, 'OrderCancelled', blockNumber);
    await processEventType(poolContract, 'OrderUpdated', blockNumber);
    await processEventType(poolContract, 'TradeExecuted', blockNumber);
    
  } catch (error) {
    console.error(`Error processing pool ${poolAddress}:`, error);
  }
}

// Generic event processor
async function processEventType(contract, eventName, blockNumber) {
  try {
    const filter = contract.filters[eventName]();
    const events = await contract.queryFilter(filter, blockNumber, blockNumber);
    
    for (const event of events) {
      await storeEventInDatabase(eventName, event.args, event.transactionHash);
    }
  } catch (error) {
    console.error(`Error processing ${eventName} events:`, error);
  }
}

// Store event in PostgreSQL
async function storeEventInDatabase(eventType, args, txHash) {
  try {
    switch (eventType) {
      case 'OrderCreated':
        await dbPool.query(
          'INSERT INTO orders(order_id, trader, price, amount, order_type, tx_hash, created_at) VALUES($1, $2, $3, $4, $5, $6, $7)',
          [args.orderId, args.trader, args.price, args.amount, args.orderType, txHash, new Date()]
        );
        break;
        
      case 'OrderCancelled':
        await dbPool.query(
          'UPDATE orders SET cancelled_at = $1 WHERE order_id = $2',
          [new Date(), args.orderId]
        );
        break;
        
      case 'OrderUpdated':
        await dbPool.query(
          'UPDATE orders SET amount = $1, updated_at = $2 WHERE order_id = $3',
          [args.newAmount, new Date(), args.orderId]
        );
        break;
        
      case 'TradeExecuted':
        await dbPool.query(
          'INSERT INTO trades(buyer, seller, amount, price, tx_hash, executed_at) VALUES($1, $2, $3, $4, $5, $6)',
          [args.buyer, args.seller, args.tradeAmount, args.price, txHash, new Date()]
        );
        break;
    }
  } catch (error) {
    console.error(`Error storing ${eventType} event:`, error);
  }
}

// Main execution
async function main() {
  await initializeKnownPools();
  
  // Start listening to new blocks
  provider.on('block', processBlock);
  
  console.log('Listener started');
}

main().catch(console.error);