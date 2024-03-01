<script>
    export let categories, selectedCategory

    const toggleCategorie = (category)=>{
        if (selectedCategory == category) {
            selectedCategory = undefined
        }else{
            selectedCategory = category
        }
    }
</script>


{#each categories as cat}
    <a href="#" role="button" class={selectedCategory==cat?'':'outline'} on:click={()=>toggleCategorie(cat)}>{cat.data().title}</a> &nbsp;
{/each}
