<script>
    import { _getDoc, _getDocs, _updateDoc } from '$utils/firebase/firestore/basics'
    import { arrayRemove, arrayUnion, doc, onSnapshot } from "firebase/firestore"
    import { db } from "$utils/firebase/firebase"
    import {params} from '@roxi/routify'
    import Routes from '$components/contest/Routes.svelte'
    import Lines from '$components/contest/Lines.svelte'
    import { collection, query } from "firebase/firestore";

    import { gymRouteToEventRoute } from '$utils/contest';
    const eventId = $params.eventId

    let event, loading, formatedRoutes, gym, categories
    let selectedRoute = {}
    
    const getEvent = async() =>{
        loading = true
        event = await _getDoc('events', eventId)
        gym = await _getDoc('gyms', event.data().gymName)
        categories = await _getDocs('events', event.id, 'categories')
        const gymRoutes = await _getDocs('gyms', gym.id, 'routes')
        formatedRoutes = gymRoutes.map(x=>gymRouteToEventRoute(x, gym))
        loading = false
    }
    
    const q = query(collection(db, "events", eventId, 'categories'))
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
        getEvent()
    })

    const delRoute = async (route, cat)=>{
        await _updateDoc({routes:arrayRemove(route)}, 'events', eventId, 'categories', cat.id)
        console.log('done');
    }

</script>



{#if event && formatedRoutes && categories}
    <h1>{event.data().title}</h1>
    <Lines routes={formatedRoutes} {event} {categories} bind:selectedRoute={selectedRoute}/>
       
    <h3>Voies à problème qui ne sont pas dans gym</h3>
    {#each categories as cat}
        <strong>{cat.data().title}</strong><br>
        <ul>
            {#each cat.data().routes as route}
                {#if !formatedRoutes.map(x=>x.id).includes(route.id) && route.grade != 'TP'}
                    <li>
                        <span class='red'>
                            <a href="#" role="button" class='outline' on:click={()=>delRoute(route, cat)}>
                                {route.grade} {route.color} ligne {route.lineNb}
                            </a>
                        </span>
                    </li>
                {/if}
            {/each}
        </ul>
        
    {/each}
{/if}



<style>
.faded{
    opacity: 0.4;
    display: none;
}

.red{
    font-weight: bold;
    color: red;
}
</style>