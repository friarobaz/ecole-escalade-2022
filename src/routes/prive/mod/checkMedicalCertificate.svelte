<script>
    import {params} from '@roxi/routify'
    import { getStudent } from '$firestore/getStudent'
    import { printName } from '$utils/printName'
    import {changeState} from '$firestore/changeState'
    import Boolean from '$components/htmlElements/Boolean.svelte'
    let seasonName = $params.season
    let studentId = $params.id
    let student, error
    let loading = false

    const refreshStudent = async ()=>{
            loading = true
            try {
                student = await getStudent(studentId)
                loading = false
            } catch (e) {
                error = e
                loading = false
            }
    }

    refreshStudent()

    const handleClick = async (status)=>{
        loading = true
        console.log("Changing state")
        try {
            await changeState(studentId, "medicalCertificate", status, seasonName)
            await refreshStudent()
            console.log("done")
            loading = false
        } catch (error) {
            console.error(error)
            loading = false
        }
    }
</script>

{#if !student}
    {#if loading}
        <p aria-busy="true">Merci de patienter...</p>
    {:else if error}
        <div style="color:red">
            <strong>Utilisateur non trouvé</strong><br><br>
            <small>{error}</small>
        </div> 
    {/if}
{:else } 
    <h1>{printName(student.public)}</h1>
    <h4>{seasonName}</h4>
    {#if student.private.medicalCertificateLink}
        <div><a href={student.private.medicalCertificateLink} target="_new">Cliquez ici pour voir le certificat médical</a></div>
    {:else}
        <div style="color:red; font-weight:bold">Aucun certificat trouvé !</div>
    {/if}
    <br>
    {#if student.public.seasons[seasonName]}
        <div>Status actuel :
            {#if loading}
                <span aria-busy={loading}></span>
            {:else}
                <Boolean value={student.public.seasons[seasonName].medicalCertificate} big={true}/>
            {/if}
        </div>
        <br>
        <dir role="button" class="outline" on:click={()=>handleClick("yes")}>Valider <Boolean value="yes" big={true}/></dir>
        <dir role="button" class="outline" on:click={()=>handleClick("waiting")}>Mettre en attente <Boolean value="waiting" big={true}/></dir>
        <dir role="button" class="outline" on:click={()=>handleClick("no")}>Refuser <Boolean value="no" big={true}/></dir>
        {:else}
            L'élève n'est pas inscrit sur cette saison
    {/if}
{/if}
    <br><br><br><br><br>

<style>
    a{
        font-weight: bold;
        font-size: x-large;
    }
</style>