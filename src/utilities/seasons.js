import { BError } from "berror"

export const seasons = () => {
  try {
    const string = (year) => {
      return `${year}-${year + 1}`
    }
    const seasonObject = (year) => {
      return {
        current: string(year),
        last: string(year - 1),
        next: string(year + 1),
      }
    }
    const currentMonth = parseInt(dayjs().format("M"))
    const juneOrLater = currentMonth > 5
    const thisYear = parseInt(dayjs().format("YYYY"))

    if (juneOrLater) return seasonObject(thisYear)
    return seasonObject(thisYear - 1)
  } catch (error) {
    throw new BError("$utils/seasons => seasons()", error)
  }
}
