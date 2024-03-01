<script>
    import { _getDocs } from "$utils/firebase/firestore/basics";
    /*
    The route object needs to have this format:
        {
            color: 'Rose',
            grade: '6a',
            id 'fsdkljfhsdf'
            lineNb: 4,
            lineTxt: 'dièdre'
        }
    */
    import RouteButton from "./RouteButton.svelte"
    import RouteCategories from './RouteCategories.svelte'
    import { arrayUnion, doc, onSnapshot, collection, query, where } from "firebase/firestore"
    import { db } from "$utils/firebase/firebase"
    export let route, selectedRoute, event, categories, done

    const toggleSelected = ()=>{
        if(done)return
            if (selectedRoute == route) {
                selectedRoute = undefined
            } else {
                selectedRoute = route
            }
    }

  /*   const getCategories = async ()=>{
        categories = await _getDocs('events', event.id, 'categories')
    }
    getCategories() */

    const routeIsInEvent = (route)=>{
        const ids = event.data().routes.map(x=>x.id)
        return ids.includes(route.id)
    }

</script>

<div on:click={toggleSelected}>

    <RouteButton color={route.color} text={route.grade} selected={selectedRoute==route} {done}/>
    {#if event && categories}
        
            <RouteCategories {route} {event} {categories}/>
    {/if}
</div>