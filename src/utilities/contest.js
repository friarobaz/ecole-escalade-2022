import {removeDuplicates} from '$utils/removeDuplicates'

const getLineNb = (category, routeId)=>{
    const route = category.data().routes.filter(x=>x.id===routeId)[0]
    return route.lineNb
}

export const releventRuns = (category, routeId)=>{
    if(category==undefined)throw'No category'
    const route = category.data().routes.filter(x=>x.id===routeId)[0]
    let runs = []
    if (route.color === "Toutes prises") {
        //all event runs in the category
        for (const run of category.data().runs) {
            const lineNb = getLineNb(category, run.route)
            //all runs with same lineNb
            if (lineNb == route.lineNb) {
                //don't add if same student
                if(!runs.map(x=>x.student).includes(run.student)){
                    runs.push(run)
                }
            }
        }
    } else {
        //all runs from category with routeId
        runs = category.data().runs.filter(x=>x.route==routeId)
    }
    return runs
}

export const routePoints = (routeId, category, maxPoints)=>{
    if(category==undefined)throw'No category for routePoints'
    const runs = releventRuns(category, routeId)
    if(runs.length===0) return 0
    return Math.floor(maxPoints/(runs.length))
}

export const routePotential = (routeId, category, maxPoints)=>{
    if(category==undefined)throw'No category for routePotential'
    const runs = releventRuns(category, routeId)
    if(runs.length===0) return maxPoints
    return Math.floor(maxPoints/(runs.length+1))
}

export const routeSends = (routeId, category)=>{
    if(category==undefined)throw'No category for routeSends'
    if (!category.data().runs) return 0
    const releventRuns = category.data().runs.filter(x=>x.route==routeId)
    return releventRuns.length
}

export const studentPoints = (studentId, category, maxPoints)=>{
    if(category==undefined)throw'No category for studentPoints'
    let points = 0
    if (!category.data().runs) return 0
    const releventRuns = category.data().runs.filter(x=>x.student===studentId)
    for (const run of releventRuns) {
        points += routePoints(run.route, category, maxPoints)
    }
    return points
}

export const studentsWithPoints = (category, maxPoints)=>{
    const releventPax = category.data().students
    for (const pax of releventPax) {
        pax.points = studentPoints(pax.id, category, maxPoints)
    }
    releventPax.sort(function(a, b) {return b.points - a.points})
    return releventPax
}

export const nbOfRuns = (category, studentId) =>{
    if (!category.data().runs) return 0
    const releventRuns = category.data().runs.filter(x=>x.student === studentId)
    return releventRuns.length
}

export const pointsWithStudents = (category, maxPoints)=>{
    const students = studentsWithPoints(category, maxPoints)
    let points = students.map(x=>x.points)
    points = removeDuplicates(points)
    points.sort(function(a, b) {return b - a})
    let result = []
    for (const point of points) {
            result.push({
                points:point,
                students: students.filter(x=>x.points == point),
        })
    }
    return result
}

export const rank = (student, category) =>{
    if(category==undefined)throw'No category for rank'
    const points = studentPoints(student.id, category, 1000)
    const allPoints = pointsWithStudents(category, 1000)
    const studentIndex = allPoints.map(x=>x.points).indexOf(points)
return {rank:studentIndex+1, otherStudents:allPoints[studentIndex].students}
}

export const gymRouteToEventRoute = (gymRoute, gym)=>{
    if(!gym) throw'no gym'
    return {
        id:gymRoute.id,
        lineNb: gymRoute.data().line,
        lineTxt: gym.data().lines[gymRoute.data().line-1],
        grade: gymRoute.data().grade,
        color: gymRoute.data().color
    }
}

export const studentCategory = (student, categories)=>{
    const relevantCats = categories.filter(x=>x.data().students.map(x=>x.id).includes(student.id))
    console.log(relevantCats.length);
    if (relevantCats.length > 1) throw 'Student found in multiple categories'
    if (relevantCats.length < 1) throw 'Student not found in any categories'
    return relevantCats[0]
}