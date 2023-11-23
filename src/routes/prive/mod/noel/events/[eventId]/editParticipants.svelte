<script>
    import { _getDoc, _getDocs, _updateDoc } from '$utils/firebase/firestore/basics'
    import { arrayRemove, doc, onSnapshot, arrayUnion, collection, query  } from "firebase/firestore"
    import { db } from "$utils/firebase/firebase"
    import {params} from '@roxi/routify'
    import { printName } from '$utils/printName';
    import StudentSelection from '$components/StudentSelection.svelte'
    const eventId = $params.eventId

    let event, loading, selectedStudent, selectedCategorie, categories, showOtherStudentForm, firstNameInput, lastNameInput, tmpId

    $:if(firstNameInput && lastNameInput) tmpId = `${firstNameInput}_${lastNameInput}_ID`
 
    const getEvent = async() =>{
        loading = true
        event = await _getDoc('events', eventId)
        categories = await _getDocs('events', eventId, 'categories')
        loading = false
    }

    const q = query(collection(db, "events", eventId, 'categories'))
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
        getEvent()
    })

    const delPax = async (catId, pax) =>{
        await _updateDoc({students:arrayRemove(pax)}, 'events', event.id, 'categories', catId)
    }

    const addPax = async (catId, pax) =>{
        selectedStudent = undefined
        selectedCategorie = undefined
        
        //if student is not part of EE
        if(tmpId){
            await _updateDoc({students:arrayUnion({
                firstName:pax.firstName,
                lastName:pax.lastName,
                id:pax.id,
            })}, 'events', event.id, 'categories', catId)
        }else{
            await _updateDoc({students:arrayUnion({
                firstName:pax.data().firstName,
                lastName:pax.data().lastName,
                id:pax.id,
            })}, 'events', event.id, 'categories', catId)
        }
        firstNameInput = ''
        lastNameInput = ''
        tmpId = undefined
        selectedStudent = undefined
    }

    $:if(selectedStudent && selectedCategorie!=undefined){
        addPax(selectedCategorie, selectedStudent)
    }
   
   const selectCategorie = (catId)=>{
    if (selectedCategorie == catId) {
        selectedCategorie = undefined
    } else {
        selectedCategorie = catId
    }
   }
</script>

{#if categories}
    <hgroup>
        <h1>Rajouter ou supprimer des participants</h1>
        <h2>{event.data().title}</h2>
    </hgroup>
    {#each categories as cat}
        <div class='cat'>
            <hgroup>
                <h4>{cat.data().title}</h4>
                <h5>{cat.data().students.length} participants</h5>
            </hgroup>
            <ul>
                {#each cat.data().students as pax}
                    <li>
                        {printName(pax, cat.data().students)}
                        <a href="#" on:click={()=>delPax(cat.id, pax)}>🗑️</a>
                        <br>
                    </li>
                {/each}
                <li>
                    <a href="#" on:click={()=>selectCategorie(cat.id)}>➕ Ajouter</a>
                </li>
            </ul>
            {#if selectedCategorie==cat.id}
                Enfant ne faisant pas partie de l'école d'escalade <input type="checkbox" role="switch" bind:checked={showOtherStudentForm}>
                <br><br>
                {#if showOtherStudentForm}
                    Prénom <input type="text" bind:value={firstNameInput}><br>
                    Nom <input type="text" bind:value={lastNameInput}><br>
                    <a href="#" role="button" on:click={()=>selectedStudent={firstName:firstNameInput, lastName:lastNameInput, id:tmpId}}>Ajouter</a>
                {:else}
                    <StudentSelection bind:selectedStudent={selectedStudent}/>
                {/if}
            {/if}
        </div>
    {/each}
{/if}


<style>
    ul li{
        list-style: none;
    }

    ul{
        border-left: 1px solid black;
        padding: 10px;
    }



</style>