import GoBackButton from "../../common/go-back";
import { Separator } from "../../ui/separator";
import { Breadcrumbs } from "../breadcrumb/breadcrumbs";

export const SubNavHeader = () => {
  return (
    <div className="flex flex-row items-center justify-start h-16">
      <div className="h-16 w-16 flex items-center justify-center border-r border-border">
        <GoBackButton />
      </div>
      <div className="h-16 w-auto min-w-80 border-x flex items-center justify-start px-6">
        <Breadcrumbs className="text-md" />
      </div>
    </div>
  );
};
