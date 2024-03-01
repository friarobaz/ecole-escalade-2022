import { _getDoc } from "$firestore/basics"
import { seasons } from "$utils/seasons"
import { BError } from "berror"

export const getSeasonFromFirestore = async (name) => {
  try {
    if (!name) throw "No name"
    const doc = await _getDoc("seasons", name)
    return doc.data()
  } catch (error) {
    throw new BError("$firestore/season => getSeasonFromFirestore()", error, {
      name,
    })
  }
}

export const getSeason = async (time = "current") => {
  try {
    const name = seasons()[time] || 'benevoles'
    return await getSeasonFromFirestore(name)
  } catch (error) {
    throw new BError("$firestore/season => getSeason()", error)
  }
}
