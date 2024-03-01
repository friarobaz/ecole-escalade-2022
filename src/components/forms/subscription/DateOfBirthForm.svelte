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
        {/if}
        {#if $allowWrongAge}
            <br>
            <small>Un moniteur a donné son accord pour accepter cet élève même si son âge ne correspond pas au cours.</small>
            <br><br>
            <span><input type="checkbox" bind:checked={hideWarning}></span>
            <small>J'ai vérifié la date de naissance et je veux continuer l'inscription.</small>
        {:else}
            <br>
            <small style="color:grey">
                <i>
                Si vous pensez que votre enfant peut participer à ce cours même si son âge ne correspond pas,
                vous pouvez faire une demande de dérogation.
                Les demandes de dérogation seront étudiées au cas par cas, <b>uniquement pour les élèves déjà connus des moniteurs.</b>
                Elles seront accéptées si le moniteur éstime que l'élève pourra profiter du cours malgré sa différence d'âge.
                <br>
                Pour faire une demande de dérogation, envoyez un mail à cette adresse : 
                <a href="mailto:julesmarchand74@gmail.com?subject=[Ecolde d'escalade] Demande de dérogation {$currentDay.weekday} {$currentDay.startTime}" target="_new">julesmarchand74@gmail.com</a>
                </i>
            </small>
            <br><br>
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