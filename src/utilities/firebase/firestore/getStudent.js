import { _getDoc } from "$firestore/basics"
import { BError } from "berror"

export const getStudent = async (studentId) => {
  try {
    if (!studentId) throw "No id"
    const publicData = await _getDoc("students", studentId)
    const privateData = await _getDoc(
      "students",
      studentId,
      "privateCol",
      "privateDoc"
    )
    //console.log("Found student")
    return { public: publicData, private: privateData }
  } catch (error) {
    console.error(`Could not find student with id ${studentId}`)
    throw new BError("function getStudent not working", error).log()
  }
}