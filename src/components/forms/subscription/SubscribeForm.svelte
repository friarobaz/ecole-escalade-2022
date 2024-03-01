<script>
    import AdultSubscriptionForm from "./adult/AdultSubscriptionForm.svelte"
    import ChildSubscriptionForm from "./child/ChildSubscriptionForm.svelte"
    import { currentSeason, currentDay, subscriptionStatus, subscription, admin } from '$utils/stores'
    import { getDayName, getDayUrl } from '$utils/days'
    import YearWarning from "./YearWarning.svelte"
    import InfoMessage from "./InfoMessage.svelte"
    import { goto } from "@roxi/routify"

    export let adult

    //Check if everyone should be able to subscribe or only past students
    const today = dayjs()
    const dateOfNoRestriction = dayjs($currentSeason.dateOfNoRestriction)
    const timeUntilNoRestrictions = dateOfNoRestriction.diff(today, "seconds")
    const pastStudentsOnly = timeUntilNoRestrictions>0

    const handleSubmit = () => {
        $subscriptionStatus = 'imageRights'
    }
</script>

<form on:submit|preventDefault={handleSubmit}>

    <hgroup>
        <h1>{getDayName($currentDay)}</h1>
        <h1>Saison {$currentSeason.name}</h1>
    </hgroup>
    
    <YearWarning />
    
    {#if pastStudentsOnly && $admin===false}
        <InfoMessage msg="Inscription reservée aux élèves inscrits l'année dernière (jusqu'au {dateOfNoRestriction.format('dddd D MMMM YYYY à HH:mm')})" />

        <!-- This section is only there for the first year, delete once everyone is subscribed -->
        {#if adult}
            <AdultSubscriptionForm {pastStudentsOnly}/>
        {:else}
            <ChildSubscriptionForm {pastStudentsOnly}/>
        {/if}
        <!-- End of TMP section -->
    {:else}     
        {#if adult}
            <AdultSubscriptionForm />
        {:else}
            <ChildSubscriptionForm />
        {/if}
    {/if}
    <footer>
        <button type="button" class='secondary outline' on:click={$goto(`/creneaux/[day]`, {day:getDayUrl($currentDay)})}>Annuler</button>
       <!--  {#if !pastStudentsOnly}
            <button>Valider</button>
        {/if} -->
        <!-- This section is only there for the first year, delete once everyone is subscribed -->
            <button>Valider</button>
        <!-- End of TMP section -->
    </footer>
</form>

<style>
    h1{
        text-transform: capitalize;
    }
    footer{
        display: flex;
        justify-content: space-between;
        gap: 10px;
    }
</style>