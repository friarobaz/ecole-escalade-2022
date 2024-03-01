<script>
    import ParentInfo from './ParentInfo.svelte'
    import ChildInfo from './ChildInfo.svelte'
    import { subscription } from '$utils/stores'
    export let pastStudentsOnly = false
    export let selectedStudent

    $:if(selectedStudent) {
            $subscription.privateInfo.parents = selectedStudent.private.parents
        //console.log($subscription.privateInfo.parents);
    }
    $: parents = $subscription.privateInfo.parents

    const removeParent = ()=>{
        if (parents.length<=1) return 
        $subscription.privateInfo.parents.pop()
        $subscription = $subscription
    }
    const addParent = ()=>{
        $subscription.privateInfo.parents.push({})
        $subscription = $subscription
    }
</script>

<section>

    <ChildInfo {pastStudentsOnly} bind:selectedStudent/>
 
    {#each parents as parent, i}
        <ParentInfo nb={i+1} {parent}/>
    {/each}

   


    <div style="display:flex; justify-content:space-between">
         <div >
            <div role="button" class="outline" on:click|preventDefault={addParent}>✚ Ajouter un parent</div>
        </div>
        <div>
            {#if parents.length>1}
                <div class="outline delete" role="button" on:click|preventDefault={removeParent}>✕ Supprimer le dernier parent</div>
            {/if}
        </div>
    </div>
   
    
</section>

<style>
    .delete{
        color:red;
        border-color: red;
        opacity: 0.6;
    }
</style>


