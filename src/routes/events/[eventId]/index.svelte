<script>
    import { _getDoc, _getDocs, _query } from '$utils/firebase/firestore/basics';
     import {params} from '@roxi/routify'
     const eventId = $params.eventId
     let event, loading, categories
     $:if (eventId) {
        getEvent()
     }

     const getEvent = async () =>{
        loading = true
        if (eventId==='latest') {
            const events = await _query('events', 'timestamp', '>', 0, 'timestamp', 'desc' )
            event = events[0]

        }else{
            const doc = await _getDoc('events', eventId)
            event = doc
        }
        categories = await _getDocs('events', event.id, 'categories')
        loading = false
     }
</script>

{#if eventId}
    {#if loading}
        loading
    {:else}
        {#if event && categories}
            <h1>{event.data().title}</h1>
            <center><h3>Catégories</h3></center>
            <div class="container">
                {#each categories as cat}
                    <div class="button">
                        <a href="./{event.id}/{cat.id}/points" role="button">{cat.data().title}</a>
                    </div>
                {/each}
                <div class="button">
                    <a href="/prive/mod/noel/events/{event.id}" role="button" class='outline'>Admin</a>
                </div>
            </div>
        {:else}
            Pas d'évènement
        {/if}
    {/if}
{:else}
    Pas d'id
{/if}

<style>
    .container{
        display: flex;
        align-items: center;
        flex-direction: column;
    }

    .button{
        margin: 10px;
    }

    a{
        width: 200px;
    }

</style>