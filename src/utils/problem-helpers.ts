// Helper functions to handle the array format from Motoko
import type { Problem } from "@/declarations/backend/backend.did"

export function getImageUrl(problem: Problem): string | null {
  return problem.imageUrl && problem.imageUrl.length > 0 ? problem.imageUrl[0] || null : null
}

export function getClassroomId(problem: Problem): string | null {
  return problem.classroomId && problem.classroomId.length > 0 ? problem.classroomId[0] || null : null
}

export function hasClassroom(problem: Problem): boolean {
  return problem.classroomId && problem.classroomId.length > 0
}

export function hasImage(problem: Problem): boolean {
  return problem.imageUrl && problem.imageUrl.length > 0
}
