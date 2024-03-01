<script>
    import {params} from '@roxi/routify'
    import {printName} from '$utils/printName'
    import { _getDoc, _updateDoc } from '$utils/firebase/firestore/basics'
    import { nbOfRuns, rank, studentPoints } from '$utils/contest';
    import Lines from '$components/contest/Lines.svelte';
  
    const catId = $params.categorie
    const eventId = $params.eventId
    const studentId = $params.studentId
    let loading, category, student, studentRoutes, selectedRoute

const getCategory = async () =>{
    loading = true
    category = await _getDoc('events', eventId, 'categories', catId)
    student = category.data().students.filter(x=>x.id==studentId)[0]
    const studentRouteIds = category.data().runs.filter(x=>x.student==student.id).map(x=>x.route)
    studentRoutes = category.data().routes.filter(x=>studentRouteIds.includes(x.id))
    loading = false
 }

 getCategory()



</script>

{#if category}
    
        <hgroup>
            <h1>{printName(student)}</h1>
            <h4>Classement : {rank(student, category).rank} &nbsp; &nbsp;({studentPoints(student.id, category, 1000)} points, {nbOfRuns(category, student.id)} voies)</h4>
        </hgroup>

        <Lines routes={studentRoutes} showMulticolor={false} bind:selectedRoute={selectedRoute}/>
    
{/if}

<style>
   
</style>