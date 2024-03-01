<script>
    import { _getDoc, _getDocs} from '$utils/firebase/firestore/basics'
    import {params} from '@roxi/routify'
    let eventId = $params.eventId
    let event, loading, categories
    
    const getEvent = async ()=>{
        loading = true
        event = await _getDoc("events", eventId)
        categories = await _getDocs('events', eventId, 'categories')
        loading = false
    }
    getEvent()
    

</script>


{#if loading}
    Merci de patienter
{:else}
    {#if event}
        <h1>{event.data().title}</h1>
        
 
            <a href="./{eventId}/addRun" role="button">Ajouter un run</a><br>
            <br><br>
            Voies :<br>
            {#each categories as cat}
                <a href="/events/{eventId}/{cat.id}/routes" role="button" class="outline">{cat.data().title}</a> &nbsp;
            {/each}
            <br><br>
            Classement :<br>
            {#each categories as cat}
                <a href="/events/{eventId}/{cat.id}/points" role="button" class="outline">{cat.data().title}</a> &nbsp;
            {/each}
            <br><br>
            <a href="/events/{eventId}">Page publique de l'évènement</a><br>
            <br>
            <a href="./{eventId}/editRoutes">Modifier les voies</a><br>
            <a href="./{eventId}/editParticipants">Modifier les participants</a><br>
            <a href="./{eventId}/deleteRun">Supprimer un run</a><br>

    {:else}
        Pas d'evenement avec cet id
    {/if}
{/if}

