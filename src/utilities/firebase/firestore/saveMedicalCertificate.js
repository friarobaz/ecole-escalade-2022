import { _updateDoc } from "$firestore/basics"
//import { writeTimeStamp } from "$utils/firebase/firestore/writeTimestampUNUSED"
import { BError } from "berror"

export const saveMedicalCertificate = async (studentId, link, seasonName) => {
  try {
    if (!studentId) throw "no student id"
    if (!link) throw "no link"
    if (!seasonName) throw "no season name"

    const timestamp = dayjs().format("D MMMM YYYY à HH:mm")

    await _updateDoc(
      { medicalCertificateLink: link, medicalCertificateTimestamp: timestamp },
      "students",
      studentId,
      "privateCol",
      "privateDoc"
    )

    /* //write timestamp
    await writeTimeStamp(studentId) */

    /*     console.log("saving public doc")
    await _updateDoc(
      {
        [`seasons.${seasonName}.medicalCertificate`]: "waiting",
      },
      "students",
      studentId
    ) */
    console.log("Medical certificate saved")
    return
  } catch (error) {
    throw new BError(
      "$firestore/saveMedicalCertificate => saveMedicalCertificate()",
      error
    )
  }
}
