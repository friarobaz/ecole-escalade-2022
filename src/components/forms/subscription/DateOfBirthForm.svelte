<script>
    import {getAge} from "$utils/ageGroups"
    /*-----------------------------------------------------------------------------------------
    This components asks for date of birth and checks it
    It has a mim and max date values
    MIN > the student must be a certain age at the time of subscription
    MAX > the year of their birthday must not be higher than a value (minYear)
    -------------------------------------------------------------------------------------------*/
    import { validateDateOfBirth, getMinAndMaxDate } from '$utils/dateOfBirth'
    import { currentDay, currentSeason, allowWrongAge } from '$utils/stores'
    export let dateOfBirth
  
    let hideWarning = false
    let status
    const {minDate, maxDate} = getMinAndMaxDate($currentDay, $currentSeason)
    
    const updateStatus = ()=>{

        // Get year
        let year = parseInt(dateOfBirth.split('-')[0])

        // If user is not done writing the date, do not display age warning
        if(year<1900){
            status = {valid: null}
            return
        }
        
        status = validateDateOfBirth(dateOfBirth, $currentDay, $currentSeason)
        
    }

    // When user writes date of birth
    $: if(dateOfBirth) {

        // Update status + age + subscription
        updateStatus()
        
    // If no date input (or incomplete) remove warning
    }else{
        status = {valid: null}
    }
</script>


<div>
    <!-- {getAge(dateOfBirth)} -->
    <label for="dateOfBirth">Date de naissance</label>
    {#if hideWarning}
        <input type="date" required bind:value={dateOfBirth} aria-invalid={!status.valid}>
    {:else}
        <input type="date" required bind:value={dateOfBirth} aria-invalid={!status.valid} max={maxDate} min={minDate}>
    {/if}
</div>
{#if status.valid !== null}     
    {#if status.valid}
        <div class="green">
            <span>✓</span>
            <small>{status.msg}</small>
        </div>
    {:else}
        {#if !hideWarning}
            <div class="red">
                <span>✕</span>
                <small>{status.msg}</small><br>
            </div>
            <br>
        {/if}
        {#if $allowWrongAge}
            <small>Un moniteur (Jules ou Jelena) a donné son accord pour accepter cet élève même si son âge ne correspond pas au cours.</small>
            <br><br>
            <span><input type="checkbox" bind:checked={hideWarning}></span>
            <small>J'ai vérifié la date de naissance et je veux continuer l'inscription.</small>
        {/if}
    {/if}
{/if}
<br>

<style>
    span{
        font-size: x-large;
        font-weight: bold;
        margin-right: 0.1em;
    }
    .green{
        color:green;
    }
    .red{
        color:red;
    }
</style>