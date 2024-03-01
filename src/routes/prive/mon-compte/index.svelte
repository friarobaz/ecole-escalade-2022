<script>
    export let context
    import {_getDoc, _query} from "$firestore/basics"
    import { currentSeason, students,  } from '$utils/stores'
    import { getFunctions, httpsCallable } from "firebase/functions"
    import { getAuth } from "firebase/auth"
    import StudentsStatusTable from '$components/tables/StudentsStatusTable.svelte'
    import ErrorMessage from '$components/htmlElements/ErrorMessage.svelte'
    import { goto } from "@roxi/routify"
    let error = null
    

    const getMyStudents = async()=>{
      let myStudents = await _query("students", "parents", "array-contains", getAuth().currentUser.uid)
      myStudents = myStudents.filter(x=>x.data().seasons[$currentSeason.name])
      //auto redirect if only one student found
      //if(myStudents.length === 1) $goto("/prive/mon-compte/[id]", {id:myStudents[0].id}, true)
      return myStudents
    }

    let myStudents = getMyStudents()

    
</script>

<h2>Mes inscriptions</h2>
{#await myStudents}
  <p aria-busy="true">
    Merci de patienter...
  </p>
{:then myStudents} 
    
    <p>Cliquez sur une inscription pour plus de détails.</p>
    <br>
    <StudentsStatusTable students={myStudents}/>
{:catch}
    <ErrorMessage error='inscriptions non trouvées.'/>
{/await}



<slot></slot>