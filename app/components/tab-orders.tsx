import { SlidersHorizontal, Zap } from "lucide-react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

interface TabsOrderProps {
  limitOrder: React.ReactNode;
  marketOrder: React.ReactNode;
}

const TabsOrder: React.FC<TabsOrderProps> = ({ limitOrder, marketOrder }) => {
  const tabs = [
    {
      name: "Limit Order",
      value: "limit-order",
      icon: (
        <SlidersHorizontal
          className="-ms-0.5 opacity-60"
          size={12}
          strokeWidth={2}
          aria-hidden="true"
        />
      ),
      content: limitOrder,
    },
    {
      name: "Market Order",
      value: "market-order",
      icon: (
        <Zap
          className="-ms-0.5 opacity-60"
          size={12}
          strokeWidth={2}
          aria-hidden="true"
        />
      ),
      content: marketOrder,
    },
  ];
  return (
    <Tabs defaultValue={tabs[0].value}>
      <TabsList className="mb-3 gap-1 bg-transparent">
        {tabs.map((tab) => (
          <TabsTrigger
            key={tab.value}
            value={tab.value}
            className="rounded-full data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-none"
          >
            {tab.icon}
            {tab.name}
          </TabsTrigger>
        ))}
      </TabsList>
      {tabs.map((tab) => (
        <TabsContent key={tab.value} value={tab.value}>
          {tab.content}
        </TabsContent>
      ))}
    </Tabs>
  );
};

export default TabsOrder;
