<script>
    import {params} from '@roxi/routify'
    import { _getDoc } from '$utils/firebase/firestore/basics'
    const catId = $params.categorie
    const eventId = $params.eventId
    let event, loading, categorie

const getEvent = async () =>{
    loading = true
    event =  await _getDoc('events', eventId)
    categorie = await _getDoc('events', eventId, 'categories', catId)
    loading = false
 }

 getEvent()
</script>

{#if categorie}
    <center>
        <h1>{categorie.data().title}</h1>
    </center>
    <div class="container">
        <a href="./{catId}/points" role="button">Classement</a>
    </div>
{/if}

<style>
   
</style>