import type { ComponentType } from "react";
import { useCallback, useState } from "react";
import { toast } from "sonner";
import { debugError } from "@/shared/utils/lib/logger.utils";

export interface BulkAction<TData> {
  id: string;
  label: string;
  icon?: ComponentType<{ className?: string }>;
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";
  requiresConfirmation?: boolean;
  confirmationMessage?: (selectedRows: TData[]) => string;
  disabledCondition?: (selectedRows: TData[]) => boolean;
  run: (selectedRows: TData[]) => Promise<unknown> | unknown;
  successMessage?: (selectedRows: TData[]) => string;
}

export function useBulkActions<TData>({
  actions,
  onSuccess,
}: {
  actions: BulkAction<TData>[];
  onSuccess?: (action: BulkAction<TData>, selectedRows: TData[]) => void;
}) {
  const [isBulkActionLoading, setIsBulkActionLoading] = useState(false);

  const runBulkAction = useCallback(
    async (actionId: string, selectedRows: TData[]) => {
      const action = actions.find((a) => a.id === actionId);
      if (!action) {
        debugError(`Bulk action "${actionId}" not found`);
        return;
      }

      if (action.disabledCondition?.(selectedRows)) {
        toast.warning("This action cannot be performed on the selected items");
        return;
      }

      setIsBulkActionLoading(true);
      try {
        await action.run(selectedRows);
        toast.success(
          action.successMessage?.(selectedRows) ??
            `Successfully ${action.label.toLowerCase()} ${selectedRows.length} item(s)`,
        );
        onSuccess?.(action, selectedRows);
      } catch (error) {
        debugError(`Bulk action "${actionId}" failed:`, error);
        toast.error(`Failed to ${action.label.toLowerCase()} items`);
      } finally {
        setIsBulkActionLoading(false);
      }
    },
    [actions, onSuccess],
  );

  return { isBulkActionLoading, runBulkAction };
}
