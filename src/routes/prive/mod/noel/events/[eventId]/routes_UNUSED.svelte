
<!-- routify:meta reset -->
<script>
    import {routeSends, routePotential, studentPoints} from '$utils/contest'
    import Canvas from '$components/contest/Canvas.svelte'
    import { doc, onSnapshot } from "firebase/firestore"
    import { db } from "$utils/firebase/firebase"
    import { _getDoc } from '$utils/firebase/firestore/basics';
    import {params} from '@roxi/routify'
    const MAX_POINTS = 1000
    const eventId = $params.eventId
    const catId = $params.catId
    let scores = []

    const unsub = onSnapshot(doc(db, "events", eventId, 'categories', catId), (category) => {
            updateScores(category)
            
    })

    const updateScores = (category)=>{
        scores = []
        for (const route of category.data().routes) {
            scores.push({...route, potential: routePotential(route.id, category, MAX_POINTS), sends: routeSends(route.id, category)})
        }
        scores = scores
    }

</script>

{#if scores}
    <Canvas {scores}/>
{/if}