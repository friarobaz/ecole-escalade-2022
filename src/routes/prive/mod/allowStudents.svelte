<script>
    //NON UTILISE
    import {_getDoc, _updateDoc, _setDoc} from '$firestore/basics'
import { normalize } from '$utils/normalize';
    let priorityStudents = []
    let releventStudents = []
    let adminDoc, loading, input
    let unsyncedStudents = []

    const run = async()=>{
        const ref = await _getDoc("admin","admin")
        adminDoc = ref.data()
        priorityStudents = adminDoc.priorityStudents
        releventStudents = priorityStudents
    }

    run()

    const update = async()=>{
        console.log("start")
        loading = true
        const result = await _updateDoc({...adminDoc, priorityStudents}, "admin", "admin")
        unsyncedStudents = []
        loading = false
    }

    $:if(releventStudents && input){
        releventStudents = priorityStudents.filter(
                x=>(normalize(x.firstName+' '+x.lastName)).includes(normalize(input))
                || (normalize(x.lastName+' '+x.firstName)).includes(normalize(input)))
    }
</script>

Recherche : <br><br>
<input type="text" bind:value={input} style="max-width: 400px">

{#each priorityStudents as student, i}
    {#if releventStudents.includes(student)}
        <div>
            <input type="checkbox" role="switch" bind:checked={priorityStudents[i].allowed} on:change={()=>unsyncedStudents=[...unsyncedStudents, student]}>
            <span class={priorityStudents[i].allowed?"allowed":''}>
                {student.firstName} {student.lastName}
            </span>
            {#if unsyncedStudents.includes(student)}
                <a href='#' on:click={update} aria-busy={loading}>Mettre à jour</a>
            {/if}
        </div>
    {:else}
    {/if}
{/each}

<button on:click={update} style="max-width: 300px;" aria-busy={loading}>Mettre à jour</button>
    

<style>
    .allowed{
        background-color: chartreuse;
    }

    div{
        margin: 25px;
    }
    span{
        padding: 10px;
        border-radius: 10px;
    }
</style>