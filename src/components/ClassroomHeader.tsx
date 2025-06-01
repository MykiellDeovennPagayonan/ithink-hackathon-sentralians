import { Badge } from "@/components/ui/badge";
import { Users, Clock } from "lucide-react";
import type { Classroom } from "@/mockdata/classrooms";

interface ClassroomHeaderProps {
  classroom: Classroom;
  code: string;
}

export default function ClassroomHeader({
  classroom,
  code,
}: ClassroomHeaderProps) {
  return (
    <div className="text-center mb-6 sm:mb-8">
      <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-2 break-words">
        {classroom.name}
      </h1>
      <p className="text-gray-600 text-sm sm:text-base lg:text-lg max-w-4xl mx-auto leading-relaxed break-words">
        {classroom.description}
      </p>
      <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-4 mt-4 text-xs sm:text-sm text-gray-500">
        <div className="flex items-center gap-1">
          <Users className="w-4 h-4" />
          {classroom.students} students
        </div>
        <div className="flex items-center gap-1">
          <Clock className="w-4 h-4" />
          Created {classroom.created}
        </div>
        <Badge variant="outline" className="text-xs flex items-center">
          Code: {code}
        </Badge>
      </div>
    </div>
  );
}
