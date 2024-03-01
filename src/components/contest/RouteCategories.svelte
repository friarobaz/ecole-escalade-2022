<script>
    import { _addDoc, _getDoc, _updateDoc } from "$utils/firebase/firestore/basics";
    import { arrayRemove, arrayUnion } from "firebase/firestore";
    
    export let route, event, categories
    let loading
    let selectedCatIds = route.categories

    const routeIsInCategory = ( catId) =>{
        const index = categories.map(x=>x.id).indexOf(catId)
        const cat = categories[index]
        const ids = cat.data().routes.map(x=>x.id)
        
        return ids.includes(route.id)
    }

    const toggle= async (catId)=>{
        if(loading)return
        loading = true
        const catIndex = categories.map(x=>x.id).indexOf(catId)
        const category = categories[catIndex]
       if (routeIsInCategory(catId)) {
            await _updateDoc({routes:arrayRemove(route)}, 'events', event.id, 'categories', catId)
        } else {
           await _updateDoc({routes:arrayUnion(route)}, 'events', event.id, 'categories', catId)
       }
        loading = false
        return
    }

</script>

{#each categories as cat}
    <a href="#" role="button" class={routeIsInCategory(cat.id)?'':'outline'} on:click={()=>toggle(cat.id)}>{cat.data().title}</a> &nbsp;
{/each}
{#if loading}
    <span aria-busy="true"></span>
{/if}
