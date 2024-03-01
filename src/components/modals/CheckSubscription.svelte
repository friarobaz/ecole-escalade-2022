<script>
    import { subscription, currentDay, currentSeason, error, fatal, subscriptionStatus} from '$utils/stores'
    import { getAge } from '$utils/ageGroups'
    import { getDayName } from '$utils/days'
    import { translate } from '$utils/TRANSLATE'
    import { createNewStudent } from '$firestore/createNewStudent'
    import { printName } from '$utils/printName'
    import { isDayFull } from '$firestore/dayIsFull'
    import ErrorMessage from '$components/htmlElements/ErrorMessage.svelte'
    import { BError } from "berror"
    import { getAuth} from "firebase/auth"
    import { _updateDoc } from '$utils/firebase/firestore/basics';
    export let adult
   
    let full = false
    let loading = false

    const submitSubscription =  async () => {
      try {
        loading = true
        const dayUrl = $subscription.publicInfo.seasons[$currentSeason.name].day
        full = await isDayFull(dayUrl, $currentSeason.name, $currentSeason.days)
        if(full) return
        const timestamp = dayjs().unix()
        $subscription.publicInfo.seasons[$currentSeason.name].timestamp = timestamp
        $subscription.publicInfo.parents = [getAuth().currentUser.uid]
        //if student already exists
        if ($subscription.id) {
          const season = {
            day: dayUrl,
            licence: "no",
            medicalCertificate: "no",
            payment: "no",
            status: "no",
            timestamp
          }
          await _updateDoc({[`seasons.${$currentSeason.name}`]:season}, 'students', $subscription.id)
        }else{
          const studentId = await createNewStudent($subscription, $currentSeason)
          $subscription.id = studentId
        }
        $subscriptionStatus = 'uploadedToFirestore'
        loading = false
      } catch (err) {
        loading = false
        const e = new BError("$components/CheckSubscription.svelte => Error submitting subscription", err)
        e.log()
        $error = e
        $fatal = true
      }
    }
</script>

<dialog open>
  <article>
    {#if $subscription && $subscription.publicInfo && $subscription.privateInfo}
      <h2>Vérifiez vos informations</h2>
      <div>
        <!-- Name -->
        <h5>
          {printName($subscription.publicInfo)}
        </h5>

        <!-- Date of birth -->
        <div>Né·e le <b>{dayjs($subscription.privateInfo.dateOfBirth).format('D MMMM YYYY')}</b>
          {#if !adult}
            ({getAge($subscription.privateInfo.dateOfBirth, false)} ans)
            {/if}
        </div>

        <!-- Selected day -->
        <div>Créneau choisi : <b>{getDayName($currentDay)}</b></div>
        <br>

        <!-- If adult -->
        {#if adult}
          <div>Email: {$subscription.privateInfo.email}</div>
          <div>Téléphone : {$subscription.privateInfo.tel}</div>
          <div>Téléphone de la personne à prévenir : {$subscription.privateInfo.accidentTel}</div>
        
          <!-- If child -->
        {:else}
          <section>
            Parents :
            {#each $subscription.privateInfo.parents as parent}
            <hr>
              <div>
                <div><b>{printName(parent)}</b> <small>({translate(parent.role)})</small></div>
                <div>Email : {parent.email===undefined?'':parent.email}</div>
                <div>Téléphone : {parent.tel===undefined?'':parent.tel}</div>
              </div>
            {/each}
          </section>
        {/if}
      </div>
      {#if full}
        <ErrorMessage error="Il n'y a plus de place sur ce créneau" />
        <footer>
          <a href="/" role="button">Choisir un autre créneau</a>
        </footer>
      {:else}
        <footer>
          <a href="#" role="button" class="secondary outline" on:click={()=>$subscriptionStatus=null}>Annuler</a>
          {#if loading}
            <a href="#" role="button"  aria-busy={true}>Merci de patienter...</a>
          {:else}
            <a href="#" role="button" on:click={submitSubscription}>Confirmer l'inscription</a>
          {/if}
        </footer>
      {/if}
    {:else}
      <ErrorMessage error="Erreur, merci de recommencer l'inscription"/>
      <a href="/" role="button">Revenir à l'accueil</a>
    {/if}
  </article>
</dialog>
