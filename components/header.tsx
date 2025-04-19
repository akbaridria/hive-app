import { Button } from "./ui/button";
import { GithubIcon, BookOpenTextIcon, Wallet2Icon } from "lucide-react";

const Header = () => {
  return (
    <div className="sticky top-0 z-50 border-b border-dashed bg-background/50 backdrop-blur-sm backdrop-filter">
      <div className="container mx-auto border-x border-dashed">
        <div className="flex items-center justify-between p-4">
          <div>Hive Logo</div>
          <div className="flex items-center gap-2">
            <Button variant="outline">
                <Wallet2Icon />
                <span className="hidden md:inline">Connect Wallet</span>
            </Button>
            <div className="flex items-center">
              <Button variant="ghost" size="icon">
                <GithubIcon />
              </Button>
              <Button variant="ghost" size="icon">
                <BookOpenTextIcon />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;
