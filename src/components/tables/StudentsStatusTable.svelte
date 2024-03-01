<!-- routify:meta reset -->
<script>
    import { currentSeason, admin, mod } from "$utils/stores"
    import { getDayName, getDayFromUrl} from '$utils/days'
    import Boolean from "$components/htmlElements/Boolean.svelte"
    import { deleteStudent } from '$firestore/deleteStudent'
    import { capitalize } from '$utils/capitalize'
    import { goto } from '@roxi/routify'
    import { getAuth } from "firebase/auth"
    import { printName } from "$utils/printName";
import Tooltip from "$components/htmlElements/Tooltip.svelte"
    
    export let students = []
    export let showDay = true
    export let timestamp = false

    const studentOfCurrentUser = (student)=>{
        if(!getAuth().currentUser) return
        const userId = getAuth().currentUser.uid
        if(student.data().parents.includes(userId)) return true
        return false
    }

    let table
    $:if(table){
        new Tablesort(table)
    }

    //On click of row (not on a button but the row itself)
    const handleClick = (student)=>{
        //if admin, do nothing
        if($mod) return

        //if not current user's student, do nothing
        if(!studentOfCurrentUser(student)) return

        //if current user's student, go to profile page
        const id = student.id
        $goto("/prive/mon-compte/[id]", {id})
    }
</script>

{#if students.length > 0}
    <figure>
        <table role="grid" bind:this={table}>

            <!-- ****************   HEAD    ****************-->
            <thead>
                <tr>
                    <!-- timestamp  -->
                    {#if timestamp && $mod}
                        <th scope="col">Inscription</th>
                    {/if}

                    <!-- admin  -->
                    {#if $mod}
                        <th scope="col">Admin</th>
                    {/if}

                    <!-- name -->
                    <th scope="col">Nom</th>
               
                    <!-- day -->
                    {#if showDay}
                        <th scope="col">Créneau</th>
                    {/if}

                
                    <th scope="col">Compte</th>
                    <th scope="col">Paiement</th>
                    <th scope="col">Certificat médical</th>
                    <th scope="col">Licence</th>
                   
                </tr>
            </thead>

            <!-- ****************     BODY     ************** -->
            <tbody>
                {#each students as student}
                    {#if student.data().seasons[$currentSeason.name]}

                        <!-- Show mouse pointer only if user's student and not an admin -->
                        <tr on:click={()=>handleClick(student)} class={studentOfCurrentUser(student) && !$mod?'':'noPointer'}>

                            <!-- timestamp -->
                            {#if timestamp && $mod}
                                <td>
                                    <small style="opacity:0">{student.data().seasons[$currentSeason.name].timestamp}</small>
                                    <br>
                                    <small>{dayjs.unix(student.data().seasons[$currentSeason.name].timestamp).format("D MMM HH:mm")}</small>
                                    
                                </td>
                            {/if}

                            <!-- mod  -->
                            {#if $mod}
                                <td>
                                    <a href={`/prive/mod/${student.id}`}><span style="font-size: x-large">⚙</span></a>
                                    <a href={`/prive/mod/sendEmail?id=${student.id}`}><span style="font-size: x-large">✉</span></a>
                                </td>
                            {/if}

                            <!-- name -->
                            {#if studentOfCurrentUser(student)}
                                <td><a href={`/prive/mon-compte/${student.id}`} role="button" class="outline">{capitalize(student.data().firstName)} {student.data().lastName.toUpperCase()}</a></td>
                            {:else if $mod}
                                {#if student.data().lastName && student.data().firstName}
                                    <td><a href={`/prive/mon-compte/${student.id}`}>{capitalize(student.data().firstName)} {student.data().lastName.toUpperCase()}</a></td>
                                {:else}
                                    ???
                                {/if}
                            {:else}
                                {#if student.data().lastName && student.data().firstName}
                                    <td>{capitalize(student.data().firstName)} {student.data().lastName.toUpperCase()}</td>
                                {:else}
                                    ???
                                {/if}
                            {/if}


                            <!-- day -->
                            {#if showDay && student.data().seasons[$currentSeason.name].day}
                                <td>
                                    <div class="day">
                                        {student.data().seasons[$currentSeason.name].day}
                                    </div>
                                </td>
                            {/if}
                            
                            {#if $mod || studentOfCurrentUser(student)}
                                <!-- account -->
                                <td><Boolean value=yes big={true}/></td>

                                
                                <!-- payment -->
                                <td><Boolean value={student.data().seasons[$currentSeason.name].payment} big={true}/></td>
                                
                                <!-- certificate -->
                                <td>
                                    {#if student.data().seasons[$currentSeason.name].medicalCertificate === 'waiting' && $mod}
                                        <a href={`/prive/mod/checkMedicalCertificate?id=${student.id}&season=${$currentSeason.name}`} class='pointer'>
                                            <Boolean value='waiting' big={true}/>
                                        </a>
                                    {:else}
                                        <Boolean value={student.data().seasons[$currentSeason.name].medicalCertificate} big={true}/>
                                    {/if}
                                </td>

                                <!-- licence -->
                                <td><Boolean value={student.data().seasons[$currentSeason.name].licence} big={true}/></td>
                            {:else}
                                <td> <Tooltip msg='Vous devez être modérateur pour voir ca'>🔒</Tooltip></td>
                                <td> <Tooltip msg='Vous devez être modérateur pour voir ca'>🔒</Tooltip></td>
                                <td> <Tooltip msg='Vous devez être modérateur pour voir ca'>🔒</Tooltip></td>
                                <td> <Tooltip msg='Vous devez être modérateur pour voir ca'>🔒</Tooltip></td>
                            {/if}
                        </tr>
                    {/if}
                {/each}
            </tbody>
        </table>
    </figure>
{:else}
     <i style="color:grey">Aucun inscrit</i>
{/if}

<style>
    .pointer{
        cursor: pointer;
    }
     th{
        cursor:pointer;
        font-weight: bold;
    }

     .day{
         text-transform: capitalize;
     }
     .noPointer:hover{
        cursor: default;
     }

     a:hover{
        text-decoration: none;
     }
</style>