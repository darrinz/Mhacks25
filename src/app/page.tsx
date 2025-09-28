"use client"
import Image from "next/image";
import styles from "./page.module.css";
import MeetingForm from "@/components/form";
import { useEffect } from "react";
import { useUser } from '@auth0/nextjs-auth0/client';
import { useRouter } from 'next/navigation';

export default function Home() {
  const { user, isLoading } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/api/auth/login');
    }
  }, [user, isLoading, router]);

  if (isLoading) return <div>Loading...</div>;
  if (!user) return null;

  return (
    <MeetingForm></MeetingForm>
  );
}
