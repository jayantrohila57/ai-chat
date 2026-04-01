"use client";

import { ArchiveRestore, MessageCircle, MoreHorizontal, Pencil, Trash2 } from "lucide-react";
import type { Route } from "next";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { apiClient, getApiErrorMessage, getApiResponseData, getApiResponseMessage } from "@/core/api/api.client";
import { CHAT_ARCHIVED_THREADS_LIMIT, CHAT_RECENT_THREADS_LIMIT } from "@/module/chat/chat.data";
import { PATH } from "@/shared/config/routes";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "../../ui/alert-dialog";
import { Badge } from "../../ui/badge";
import { Button } from "../../ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "../../ui/dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../../ui/dropdown-menu";
import { Input } from "../../ui/input";
import { Label } from "../../ui/label";
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
  const [renameDialogOpen, setRenameDialogOpen] = useState(false);
  const [archiveDialogOpen, setArchiveDialogOpen] = useState(false);
  const [renameTitle, setRenameTitle] = useState(thread.title);

  const renameThread = apiClient.chat.rename.useMutation({
    onError: (error) => {
      toast.error(getApiErrorMessage(error, "Failed to rename thread."));
    },
    onSuccess: (response) => {
      toast.success(getApiResponseMessage(response, "Thread renamed."));
      setRenameDialogOpen(false);
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
      setArchiveDialogOpen(false);
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
    const trimmedTitle = renameTitle.trim();
    if (!trimmedTitle || trimmedTitle === thread.title) {
      setRenameDialogOpen(false);
      return;
    }
    await renameThread.mutateAsync({
      threadId: thread.id,
      title: trimmedTitle,
    });
  };

  const handleArchive = async () => {
    await archiveThread.mutateAsync({ threadId: thread.id });
  };

  const handleRestore = async () => {
    await restoreThread.mutateAsync({ threadId: thread.id });
  };

  const openRenameDialog = () => {
    setRenameTitle(thread.title);
    setRenameDialogOpen(true);
  };

  const isBusy = renameThread.isPending || archiveThread.isPending || restoreThread.isPending;

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <SidebarMenuAction showOnHover>
            <MoreHorizontal className="size-4" />
            <span className="sr-only">Open thread actions</span>
          </SidebarMenuAction>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          {!archived ? (
            <DropdownMenuItem disabled={isBusy} onClick={() => openRenameDialog()}>
              <Pencil className="size-4" />
              Rename
            </DropdownMenuItem>
          ) : null}
          {archived ? (
            <DropdownMenuItem disabled={isBusy} onClick={() => void handleRestore()}>
              <ArchiveRestore className="size-4" />
              Restore
            </DropdownMenuItem>
          ) : (
            <DropdownMenuItem
              disabled={archiveThread.isPending}
              onClick={() => setArchiveDialogOpen(true)}
              variant="destructive"
            >
              <Trash2 className="size-4" />
              Archive
            </DropdownMenuItem>
          )}
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Rename Dialog */}
      <Dialog onOpenChange={setRenameDialogOpen} open={renameDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Rename Chat</DialogTitle>
            <DialogDescription>Enter a new name for this chat thread.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Chat name</Label>
              <Input
                id="name"
                onChange={(e) => setRenameTitle(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    void handleRename();
                  }
                }}
                placeholder="Enter chat name..."
                value={renameTitle}
              />
            </div>
          </div>
          <DialogFooter>
            <Button onClick={() => setRenameDialogOpen(false)} type="button" variant="outline">
              Cancel
            </Button>
            <Button
              disabled={!renameTitle.trim() || renameTitle.trim() === thread.title || renameThread.isPending}
              onClick={() => void handleRename()}
              type="button"
            >
              Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Archive Confirmation Dialog */}
      <AlertDialog onOpenChange={setArchiveDialogOpen} open={archiveDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Archive Chat?</AlertDialogTitle>
            <AlertDialogDescription>
              This chat thread will be archived and disappear from recent chats. You can restore it later from the
              archived section.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction disabled={archiveThread.isPending} onClick={() => void handleArchive()}>
              Archive
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
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
          <span className="truncate">{thread.title}</span>
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
  const limit = archived ? CHAT_ARCHIVED_THREADS_LIMIT : CHAT_RECENT_THREADS_LIMIT;
  const threadsQuery = apiClient.chat.list.useQuery(
    { archived, limit },
    {
      refetchOnWindowFocus: false,
    },
  );

  const threads = (getApiResponseData(threadsQuery.data) ?? []) as ThreadListItem[];
  const hasMore = threads.length >= limit;

  if (threadsQuery.isPending) {
    return <SidebarNavSkeleton archived={archived} />;
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
          {hasMore && (
            <SidebarMenuItem>
              <SidebarMenuButton asChild>
                <Link href={(archived ? PATH.CHAT.ARCHIVE : PATH.CHAT.ALL) as Route}>
                  <span className="text-muted-foreground text-sm">...more</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          )}
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
