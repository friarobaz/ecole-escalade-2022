<script>
    import { _getDoc, _getDocs, _updateDoc } from '$utils/firebase/firestore/basics'
    import Route from '$components/contest/Route.svelte'
    import {printName} from '$utils/printName'
    import { doc, onSnapshot } from "firebase/firestore"
    import { db } from "$utils/firebase/firebase"
    
    import {params} from '@roxi/routify'
    import { arrayRemove } from 'firebase/firestore';
    let eventId = $params.eventId
    let event
    let categories = []

    const getEvent = async () =>{
        event = await _getDoc('events', eventId)
        categories = await _getDocs('events', eventId, 'categories')
    }
    
    const unsub = onSnapshot(doc(db, "events", eventId), (event) => {
        getEvent()
    })

    const delRun = async (run, category)=>{
        const res = confirm('Êtes vous sûrs de vouloir supprimer ca ?')
        if(!res) return
        await _updateDoc({runs:arrayRemove(run)}, 'events', eventId, 'categories', category.id )
        console.log('done');
    }

    const resetRuns = async(catId)=>{
        const res = confirm('Êtes vous sûrs de vouloir TOUT SUPPRIMER !!!!????')
        if(!res) return
        await _updateDoc({runs:[]}, 'events', eventId, 'categories', catId)
        console.log('done');
    }
</script>

{#if event}
    {#each categories as cat}
        <h3>{cat.data().title}</h3>
        <a href="#" on:click={()=>resetRuns(cat.id)}>Tout supprimer</a><br><br>
        <ul>
            {#each cat.data().students as pax}
                <li>
                    <strong>{printName(pax)}</strong>
                    <ul>
                        {#each cat.data().runs.filter(x=>x.student==pax.id) as run}
                            <li on:click={()=>delRun(run, cat)}>
                                {cat.data().routes.filter(x=>x.id==run.route)[0].lineTxt}
                                (ligne {cat.data().routes.filter(x=>x.id==run.route)[0].lineNb})
                                <Route {event} route={cat.data().routes.filter(x=>x.id==run.route)[0]}/>
                            </li>
                        {/each}
                    </ul>
                </li>
            {/each}
        </ul>
    {/each}
{/if}


<style>
    ul li{
        list-style: none;
    }
</style>