<script>
    import {_getDocs, _addDoc} from '$utils/firebase/firestore/basics'
    import { goto } from "@roxi/routify"
    let title, loading, selectedGym, catInput, catForm
    let categories = []

    const gyms =  _getDocs("gyms")
  

    const createEvent = async ()=>{
        loading = true
        if (!title) throw "No title"
        if (!selectedGym) throw "No gym"
        if (categories.length < 1) throw "No categories"
        const eventId = await _addDoc({title, timestamp: dayjs().unix(), gymName:selectedGym.id}, "events")
        for (const cat of categories) {
            await _addDoc({routes:[], students:[], runs:[], title:cat}, 'events', eventId, 'categories')
        }
        loading = false
        $goto('/prive/mod/noel/events/[eventId]', {eventId})
    }

    const addCat = ()=>{
        if(!catInput)return
        categories=[...categories, catInput]
        catInput = ''
        catForm.focus()
    }

    const delCat = (cat)=>{
        const index = categories.indexOf(cat)
        categories.splice(index, 1)
        categories = categories //refresh display
    }
</script>

<!-- ################################################################################################# -->

<h1>Créer un évenement</h1>

Nom de l'évènement :<br>
<input type="text" bind:value={title}>

<!-- ******************************************************************** -->

<h3>Catégories</h3>
<form on:submit|preventDefault={addCat}>
    <input type="text" bind:value={catInput} bind:this={catForm}>
    <a href="#" role="button" on:click={addCat}>Ajouter la catégorie</a>
</form>

{#each categories as cat}
    <a href="#" class='outline' role="button" on:click={()=>delCat(cat)}>{cat}</a>&nbsp;
{/each}

<!-- ******************************************************************** -->

<h3>Salle</h3>
{#await gyms}
    <div aria-busy=true>Fetching gyms...</div>
{:then gyms} 
    {#each gyms as gym}
        <a href="#" role="button" class={selectedGym==gym ? '' : 'outline'} on:click={()=>selectedGym = gym}>{gym.id}</a> &nbsp;
    {/each}
{/await}

<!-- ******************************************************************** -->

<br>

<br><br>

{#if loading}
    <button aria-busy=true></button>
{:else}
    <button on:click={createEvent}>Créer l'évenement</button>
{/if}


<style>
    ul li{
       list-style: none;
    }

    button{
        max-width: 300px;
    }
</style>
