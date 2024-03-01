<script>
    import { _getDoc, _getDocs } from '$utils/firebase/firestore/basics'
    import StudentSelection from '$components/StudentSelection.svelte'
    import CategorieSelection from '$components/contest/CategorieSelection.svelte'
    import Routes from '$components/contest/Routes.svelte'
    import { printName } from '$utils/printName'
    import {params} from '@roxi/routify'
    import { doc, onSnapshot, query, collection } from "firebase/firestore"
    import { db } from "$utils/firebase/firebase"
    import RunConfirmation from '$components/contest/RunConfirmation.svelte'
    import {studentCategory} from '$utils/contest'
    import Lines from '$components/contest/Lines.svelte';
    let eventId = $params.eventId
    let selectedCategory, selectedStudent, selectedRoute, loading, event, studentList, reset, categories

    const q = query(collection(db, "events", eventId, 'categories'))
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
        getEvent()
    })

    const getEvent = async ()=>{
        loading = true
        event = await _getDoc('events', eventId)
        categories = await _getDocs('events', eventId, 'categories')
        loading = false
    }

    $:if (selectedCategory!=undefined && categories) {
        studentList = selectedCategory.data().students
    }else if(categories){
        studentList = []
        //students from all categories
        for (const cat of categories) {
            studentList = [...studentList, ...cat.data().students]
        }
    }

    $:if (selectedRoute || selectedStudent) {
        window.scrollTo(0, 0);
    }

    $:if(reset){
        selectedRoute = undefined
        selectedStudent = undefined
        selectedCategory = undefined
        reset = false
    }
    
</script>


{#if loading}
    Merci de patienter
{:else}
    {#if categories}
        {#if !selectedStudent}
            <CategorieSelection {categories} bind:selectedCategory={selectedCategory}/>
            <br><br>
            <StudentSelection  {studentList} showAll=true firstNameOnly=true bind:selectedStudent={selectedStudent}/>
        {:else}
            <hgroup>
                <h3>{printName(selectedStudent)}</h3>
                <h4>{studentCategory(selectedStudent, categories).data().title}</h4>
            </hgroup>
            {#if !selectedRoute}
                <!-- <Routes routes={studentCategory(selectedStudent, categories).data().routes} bind:selectedRoute={selectedRoute}/> -->
                <Lines routes={studentCategory(selectedStudent, categories).data().routes} bind:selectedRoute={selectedRoute} showMulticolor={false} student={selectedStudent} {categories}/>
            {:else}
                
                <RunConfirmation route={selectedRoute} student={selectedStudent} {event} category={studentCategory(selectedStudent, categories)} bind:reset={reset}/>
            {/if}
        {/if}
    {/if}
{/if}