"use client";

import { Ban, Calendar, Mail, Shield, User as UserIcon } from "lucide-react";
import Image from "next/image";
import { Badge } from "@/shared/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { Separator } from "@/shared/components/ui/separator";

interface UserProfileProps {
  user?: {
    name?: string;
    email?: string;
    emailVerified?: boolean;
    image?: string | null;
    createdAt?: Date;
    role?: string;
  };
}

export function ProfileCard({ user }: UserProfileProps) {
  const name = user?.name ?? "Anonymous User";
  const email = user?.email ?? "No email provided";
  const avatar = user?.image ?? "https://api.dicebear.com/9.x/identicon/svg?seed=default";
  const created = user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : "Unknown date";
  const verified = user?.emailVerified;
  const role = user?.role ?? "user";

  return (
    <Card>
      <CardHeader>
        <div className="border-border relative h-20 w-20 overflow-hidden rounded-full border">
          <Image src={avatar} alt={`${name}'s avatar`} fill sizes="80px" className="object-cover" />
        </div>
        <CardTitle className="text-lg font-semibold">{name}</CardTitle>
        <CardDescription className="text-muted-foreground flex items-center gap-2 text-sm">
          <Mail size={14} /> {email}
        </CardDescription>
      </CardHeader>
      <Separator />

      <CardContent className="space-y-2 text-sm">
        <div className="flex items-center justify-between">
          <span className="text-muted-foreground">Type</span>
          <Badge variant="secondary" className="capitalize">
            {role}
          </Badge>
        </div>
        <Separator />

        <div className="flex items-center justify-between">
          <span className="text-muted-foreground">Email Verified</span>
          <Badge variant={verified ? "default" : "destructive"}>{verified ? "Yes" : "No"}</Badge>
        </div>
        <Separator />

        <div className="flex items-center justify-between">
          <span className="text-muted-foreground flex items-center gap-1">
            <Calendar size={14} /> Joined
          </span>
          <span>{created}</span>
        </div>
      </CardContent>
    </Card>
  );
}
