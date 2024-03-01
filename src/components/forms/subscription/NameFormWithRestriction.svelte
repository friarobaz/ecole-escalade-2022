<script>
    import {_getDoc, _getDocs, _query}from '$firestore/basics'
    import {normalize} from '$utils/normalize'
    import { printName } from '$utils/printName';
    import {allowWrongAge, subscription} from '$utils/stores'
    import { currentSeason, admin, loggedin, mod } from '$utils/stores'
    import { seasons } from "$utils/seasons"
    import { getAuth } from 'firebase/auth'
    import { getStudent } from '$utils/firebase/firestore/getStudent';
    export let firstName, lastName, selectedStudent

    let userStudents
    $:if(getAuth().currentUser) userStudents = _query("students", 'parents', 'array-contains', getAuth().currentUser.uid)
  

    //let searchInput
    //let releventStudents = []
    



    $:if(selectedStudent){
        firstName = selectedStudent.public.firstName
        lastName = selectedStudent.public.lastName
        $allowWrongAge = selectedStudent.public.allowed
        $subscription.id = selectedStudent.id
    }

    const getPastUserStudents = async ()=>{
        if (!getAuth().currentUser) throw "Not loggedin"
        let pastStudents = []
        const userStudents = await _query("students", 'parents', 'array-contains', getAuth().currentUser.uid)
        for (const student of userStudents) {
            if ((student.data().seasons[seasons().last] && student.data().seasons[seasons().last].payment == 'yes')||student.data().seasons['benevoles']) {
                let formatted = await getStudent(student.id)
                pastStudents.push(formatted)
            }
        }
        if (pastStudents.length == 1) selectedStudent = pastStudents[0]
        //releventStudents = pastStudents
        //console.log(pastStudents);
        return pastStudents
    }

    const pastStudents = getPastUserStudents()

 /*    const getPriorityStudents = async ()=>{
        const adminDoc = await _getDoc('admin', 'admin')
        const priorityStudents = adminDoc.data().priorityStudents.map(x=> {return {firstName: normalize(x.firstName), lastName:normalize(x.lastName), allowed:x.allowed}})
        console.log("priority", priorityStudents);
        releventStudents = priorityStudents
        return priorityStudents
    } */

   //Get all students who have paid last season 
    /* const getPastStudents = async ()=>{
        const pastStudents = await _query('students', `seasons.${seasons().last}.payment`, "==", "yes", 'firstName' )
        //const formatted = pastStudents.map(x=> {return {firstName: normalize(x.data().firstName), lastName:normalize(x.data().lastName), allowed:"false"}})
        //console.log('formatted', formatted);
        releventStudents = pastStudents
        return pastStudents
    } */
   
  
    

    //const priorityStudents = getPriorityStudents()
    //const priorityStudents = getPastStudents()
    //const priorityStudents = getPastUserStudents()
   
/*     const handleChange = (priorityStudents)=>{
        if(searchInput){
            releventStudents = priorityStudents.filter(
                x=>(x.data().firstName+' '+x.data().lastName).includes(normalize(searchInput))
                || (x.data().lastName+' '+x.data().firstName).includes(normalize(searchInput)))
        }else{
            releventStudents = priorityStudents
        }
        selectedStudent = releventStudents[0]
    }
     */
</script>
<!-- 
{#if $loggedin}
    {#await userStudents then userStudents}
    {#each userStudents as student}
        {student.data().firstName}
    {/each}
        {#if userStudents.length === 1}
            <a href={`/prive/mon-compte/${userStudents[0].id}`} role="button" class="outline">Mes inscriptions en cours</a>
        {:else if userStudents.length > 1}
            <a href="/prive/mon-compte" role="button" class="outline">Mes inscriptions en cours</a>
        {:else if !$mod}
            <strong style="color:red">
                Vous n'avez aucune inscription en cours, cliquez sur un créneau pour vous inscrire.
            </strong>
        {/if}
    {/await}
{:else}
<a href="/prive" role="button" class="outline">Se connecter</a>
<a href="/prive?showCreateAccount=true" role="button" class="outline">Créer un compte</a>
{/if} -->
 

{#await pastStudents}
   merci de patienter ...
{:then pastStudents} 

    <!-- <input type="search" id="search" name="search" placeholder="Chercher le nom de l'élève à inscrire" bind:value={searchInput} on:input={()=>handleChange(priorityStudents)}> -->

    <!-- {#if searchInput}    
        {#if releventStudents.length<=0}
            <small style="color:red">Aucun élève ne correspond à cette recherche</small>
        {:else if releventStudents.length === 1}
            <small>Élève trouvé !</small>
        {:else}
            <small>{releventStudents.length} élèves correspondent à cette recherche</small>
        {/if}
    {:else}
        <small>&nbsp;</small>
    {/if} -->

    {#if pastStudents.length > 1}
        
        <label for="student">Choisissez l'élève à inscrire</label>
        <select id="student" required bind:value={selectedStudent} class={pastStudents.length === 1?'success':''}>
            {#each pastStudents as student}
                <option value={student}>{printName(student.public)}</option>
            {/each}
        </select>
    {:else if pastStudents.length == 1 }
        <h3>
            {printName(pastStudents[0].public)}
        </h3>
        
    {:else if pastStudents.length == 0}
        <strong style="color:red">
            Aucun élève trouvé avec votre compte, êtes vous sûr d'avoir utilisé ce compte pour l'inscription l'année dernière ?
        </strong>
        <br><br>
    {/if}

{/await}



<style>
    span{
        font-size: x-large;
        font-weight: bold;
        margin-right: 0.1em;
    }
   
</style>