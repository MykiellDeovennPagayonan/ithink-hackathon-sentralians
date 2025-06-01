export interface ClassroomMember {
  id: string;
  name: string;
  email: string;
  role: "teacher" | "student";
  avatar: string;
  joinedAt: string;
  lastActive?: string;
}

export interface Classroom {
  id: string;
  name: string;
  teacher: string;
  description: string;
  students: number;
  created: string;
  problems: { id: string; createdAt: string; createdBy: string }[];
}

// Mock classroom data
export const mockClassrooms = [
  {
    id: "MATH101",
    name: "Advanced Calculus",
    teacher: "Prof. Martinez",
    description:
      "Explore calculus concepts through interactive problem solving",
    students: 24,
    created: "2 weeks ago",
    problems: [
      { id: "1", createdAt: "2 days ago", createdBy: "Prof. Martinez" },
      { id: "3", createdAt: "1 week ago", createdBy: "Prof. Martinez" },
      { id: "4", createdAt: "3 days ago", createdBy: "Prof. Martinez" },
      { id: "2", createdAt: "5 days ago", createdBy: "Prof. Martinez" },
      { id: "5", createdAt: "1 day ago", createdBy: "Prof. Martinez" },
    ],
  },
  {
    id: "ALG202",
    name: "Linear Algebra",
    teacher: "Dr. Wilson",
    description: "Master matrices, vectors, and linear transformations",
    students: 18,
    created: "3 weeks ago",
    problems: [
      { id: "6", createdAt: "4 days ago", createdBy: "Dr. Wilson" },
      { id: "7", createdAt: "1 week ago", createdBy: "Dr. Wilson" },
    ],
  },
  {
    id: "STAT303",
    name: "Statistics & Probability",
    teacher: "Prof. Chen",
    description: "Learn statistical methods and probability theory",
    students: 32,
    created: "1 month ago",
    problems: [
      { id: "4", createdAt: "2 days ago", createdBy: "Prof. Chen" },
      { id: "8", createdAt: "5 days ago", createdBy: "Prof. Chen" },
    ],
  },
];

// Mock classroom members for MATH101
export const mockClassroomMembers: Record<string, ClassroomMember[]> = {
  MATH101: [
    {
      id: "1",
      name: "Prof. Martinez",
      email: "martinez@university.edu",
      role: "teacher",
      avatar: "/placeholder.svg?height=40&width=40",
      joinedAt: "2 weeks ago",
      lastActive: "2 hours ago",
    },
    {
      id: "2",
      name: "Alice Johnson",
      email: "alice.j@student.edu",
      role: "student",
      avatar: "/placeholder.svg?height=40&width=40",
      joinedAt: "2 weeks ago",
      lastActive: "1 hour ago",
    },
    {
      id: "3",
      name: "Bob Smith",
      email: "bob.s@student.edu",
      role: "student",
      avatar: "/placeholder.svg?height=40&width=40",
      joinedAt: "1 week ago",
      lastActive: "3 hours ago",
    },
    {
      id: "4",
      name: "Carol Davis",
      email: "carol.d@student.edu",
      role: "student",
      avatar: "/placeholder.svg?height=40&width=40",
      joinedAt: "1 week ago",
      lastActive: "Yesterday",
    },
    {
      id: "5",
      name: "David Wilson",
      email: "david.w@student.edu",
      role: "student",
      avatar: "/placeholder.svg?height=40&width=40",
      joinedAt: "5 days ago",
      lastActive: "2 days ago",
    },
    {
      id: "6",
      name: "Emma Brown",
      email: "emma.b@student.edu",
      role: "student",
      avatar: "/placeholder.svg?height=40&width=40",
      joinedAt: "3 days ago",
      lastActive: "4 hours ago",
    },
  ],
  ALG202: [
    {
      id: "7",
      name: "Dr. Wilson",
      email: "wilson@university.edu",
      role: "teacher",
      avatar: "/placeholder.svg?height=40&width=40",
      joinedAt: "3 weeks ago",
      lastActive: "5 hours ago",
    },
    // Add more members as needed
  ],
  STAT303: [
    {
      id: "8",
      name: "Prof. Chen",
      email: "chen@university.edu",
      role: "teacher",
      avatar: "/placeholder.svg?height=40&width=40",
      joinedAt: "1 month ago",
      lastActive: "1 day ago",
    },
    // Add more members as needed
  ],
};
