"use client";

import { ArchiveRestore, MessageCircle, MoreHorizontal, Pencil, Trash2 } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { toast } from "sonner";
import { apiClient, getApiErrorMessage, getApiResponseData, getApiResponseMessage } from "@/core/api/api.client";
import { CHAT_RECENT_THREADS_LIMIT } from "@/module/chat/chat.data";
import { PATH } from "@/shared/config/routes";
import { Badge } from "../../ui/badge";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../../ui/dropdown-menu";
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
} from "../../ui/sidebar";
import { SidebarNavSkeleton } from "./sidebar.nav-skeleton";

type ThreadListItem = {
  deletedAt: Date | null;
  id: string;
  title: string;
};

function useInvalidateThreadLists() {
  const utils = apiClient.useUtils();

  return () => {
    void utils.chat.list.invalidate({ archived: false, limit: CHAT_RECENT_THREADS_LIMIT });
    void utils.chat.list.invalidate({ archived: true, limit: CHAT_RECENT_THREADS_LIMIT });
  };
}

function ThreadActions({ thread, archived }: { thread: ThreadListItem; archived: boolean }) {
  const pathname = usePathname();
  const router = useRouter();
  const utils = apiClient.useUtils();
  const invalidateLists = useInvalidateThreadLists();
  const isActive = pathname === PATH.CHAT.THREAD(thread.id);

  const renameThread = apiClient.chat.rename.useMutation({
    onError: (error) => {
      toast.error(getApiErrorMessage(error, "Failed to rename thread."));
    },
    onSuccess: (response) => {
      toast.success(getApiResponseMessage(response, "Thread renamed."));
    },
    onSettled: () => {
      invalidateLists();
      void utils.chat.get.invalidate({ threadId: thread.id });
    },
  });

  const archiveThread = apiClient.chat.archive.useMutation({
    onError: (error) => {
      toast.error(getApiErrorMessage(error, "Failed to archive thread."));
    },
    onSuccess: (response) => {
      toast.success(getApiResponseMessage(response, "Thread archived."));
      if (isActive) {
        router.push(PATH.CHAT.ROOT);
      }
    },
    onSettled: invalidateLists,
  });

  const restoreThread = apiClient.chat.restore.useMutation({
    onError: (error) => {
      toast.error(getApiErrorMessage(error, "Failed to restore thread."));
    },
    onSuccess: (response) => {
      const restoredThread = getApiResponseData(response);
      toast.success(getApiResponseMessage(response, "Thread restored."));
      if (restoredThread && isActive) {
        router.replace(PATH.CHAT.THREAD(restoredThread.id));
      }
    },
    onSettled: () => {
      invalidateLists();
      void utils.chat.get.invalidate({ threadId: thread.id });
    },
  });

  const handleRename = async () => {
    const nextTitle = window.prompt("Rename this chat", thread.title);
    const trimmedTitle = nextTitle?.trim();

    if (!trimmedTitle || trimmedTitle === thread.title) {
      return;
    }

    await renameThread.mutateAsync({
      threadId: thread.id,
      title: trimmedTitle,
    });
  };

  const handleArchive = async () => {
    const confirmed = window.confirm("Archive this chat thread? It will disappear from recent chats.");
    if (!confirmed) {
      return;
    }

    await archiveThread.mutateAsync({ threadId: thread.id });
  };

  const handleRestore = async () => {
    await restoreThread.mutateAsync({ threadId: thread.id });
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <SidebarMenuAction showOnHover>
          <MoreHorizontal className="size-4" />
          <span className="sr-only">Open thread actions</span>
        </SidebarMenuAction>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {!archived ? (
          <DropdownMenuItem
            disabled={renameThread.isPending || restoreThread.isPending}
            onClick={() => void handleRename()}
          >
            <Pencil className="size-4" />
            Rename
          </DropdownMenuItem>
        ) : null}
        {archived ? (
          <DropdownMenuItem disabled={restoreThread.isPending} onClick={() => void handleRestore()}>
            <ArchiveRestore className="size-4" />
            Restore
          </DropdownMenuItem>
        ) : (
          <DropdownMenuItem
            disabled={archiveThread.isPending}
            onClick={() => void handleArchive()}
            variant="destructive"
          >
            <Trash2 className="size-4" />
            Archive
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function ThreadItem({ archived, thread }: { archived: boolean; thread: ThreadListItem }) {
  const pathname = usePathname();
  const isActive = pathname === PATH.CHAT.THREAD(thread.id);

  return (
    <SidebarMenuItem>
      <SidebarMenuButton asChild isActive={isActive}>
        <Link href={PATH.CHAT.THREAD(thread.id)}>
          <MessageCircle className="size-4" />
          <span>{thread.title}</span>
          {archived ? (
            <Badge className="ml-auto" variant="outline">
              Archived
            </Badge>
          ) : null}
        </Link>
      </SidebarMenuButton>
      <ThreadActions archived={archived} thread={thread} />
    </SidebarMenuItem>
  );
}

function ThreadGroup({ archived, label }: { archived: boolean; label: string }) {
  const threadsQuery = apiClient.chat.list.useQuery(
    { archived, limit: CHAT_RECENT_THREADS_LIMIT },
    {
      refetchOnWindowFocus: false,
    },
  );

  const threads = (getApiResponseData(threadsQuery.data) ?? []) as ThreadListItem[];

  if (threadsQuery.isPending) {
    return <SidebarNavSkeleton />;
  }

  if (threads.length === 0) {
    return null;
  }

  return (
    <SidebarGroup className="group-data-[collapsible=icon]:hidden">
      <SidebarGroupLabel>{label}</SidebarGroupLabel>
      <SidebarGroupContent>
        <SidebarMenu>
          {threads.map((thread) => (
            <ThreadItem archived={archived} key={thread.id} thread={thread} />
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}

export function NavRecentChats() {
  return <ThreadGroup archived={false} label="Recent chats" />;
}

export function NavArchivedChats() {
  return <ThreadGroup archived label="Archived" />;
}
