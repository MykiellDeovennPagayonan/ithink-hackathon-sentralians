"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import ManualProblemForm from "@/components/ManualProblemForm";
import AiProblemGeneratorForm from "@/components/AIProblemGeneratorForm";
// import { Toaster } from "@/components/ui/toaster";

export default function CreateProblemPage() {
  const router = useRouter();

  return (
    <div className="container mx-auto max-w-4xl py-8 px-4"> {/* Reduced max-w from 7xl */}
      <Button variant="ghost" className="mb-6" onClick={() => router.back()}>
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back
      </Button>

      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Create New Problem</CardTitle>
          <CardDescription>
            Choose your method: create a problem manually with our rich editor,
            or generate one with AI.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="manual" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="manual">Manually Create</TabsTrigger>
              <TabsTrigger value="ai">Generate with AI</TabsTrigger>
            </TabsList>
            <TabsContent value="manual">
              <ManualProblemForm />
            </TabsContent>
            <TabsContent value="ai">
              <AiProblemGeneratorForm />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}