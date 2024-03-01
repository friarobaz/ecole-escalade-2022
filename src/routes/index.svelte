<script>
    export let context //just to hide warning in console
    import { currentSeason, admin, loggedin, mod } from '$utils/stores'
    import DaysRecapTable from '$components/tables/DaysRecapTable.svelte'
    import { _query } from '$utils/firebase/firestore/basics'
    import { getAuth } from 'firebase/auth'
    import { seasons } from '$utils/seasons';
    let userStudents 
    $:if(getAuth().currentUser) userStudents = _query("students", 'parents', 'array-contains', getAuth().currentUser.uid)
    
</script>

<hgroup>
    <h1>École d'escalade</h1>
    <h1>Saison {$currentSeason.name}</h1>
</hgroup>

{#if $admin}
    <a href="/prive/admin" role="button"  class="admin">Admin</a>
{/if}
{#if $mod}
    <a href="/prive/mod/accident" role="button"  class="admin">Accident</a>
    <a href="/prive/mod" role="button"  class="mod">Modérateur</a>
{/if}

{#if $loggedin}
    {#await userStudents then userStudents}
        {#if userStudents.length === 1 && userStudents[0].data().seasons[$currentSeason.name]}
            <a href={`/prive/mon-compte/${userStudents[0].id}`} role="button" class="outline">Mes inscriptions en cours</a>
        {:else if userStudents.length > 1}
            <a href="/prive/mon-compte" role="button" class="outline">Mes inscriptions en cours</a>
        {:else if !$mod}
            <strong style="color:red">
                Vous n'avez aucune inscription en cours, cliquez sur un créneau pour vous inscrire.
            </strong>
        {/if}
    {/await}
{:else}
    <a href="/prive" role="button" class="outline">Se connecter</a>
    <a href="/prive?showCreateAccount=true" role="button" class="outline">Créer un compte</a>
{/if}
<br><br>

<section>
    <DaysRecapTable />
</section>

<slot></slot> <!-- just to hide error warning in console -->

<style>
    .admin{
        background-color: rgb(224, 39, 39);
        border: 0;
    }

    .mod{
        background-color: rgb(224, 181, 39);
        border: 0;
    }
</style>