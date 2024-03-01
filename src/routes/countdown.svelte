
<script>
	import { onMount } from 'svelte'
  import {params, goto} from '@roxi/routify'
  import { currentSeason } from '$utils/stores'
  import { getAuth } from "firebase/auth"
  let resubscription = $params.resubscription
  let today = dayjs()
  const dayUrl = $params.dayUrl
  
  const dateOfNoRestriction = dayjs($currentSeason.dateOfNoRestriction)
  $:timeUntilNoRestrictions = dateOfNoRestriction.diff(today, "seconds")
  
  const resubscriptionDate = dayjs($currentSeason.resubscriptionDate)
  $:timeUntilResubscription = resubscriptionDate.diff(today, "seconds")

  $:selectedTime = resubscription ? timeUntilResubscription : timeUntilNoRestrictions
  $:console.log(selectedTime);

  $: days = Math.floor(selectedTime / 3600 / 24);
  $: dayname = days > 1 ? "jours" : "jour";
  
  $: hours = Math.floor((selectedTime - (days * 3600 * 24))/3600)
  $: hourname = hours > 1 ? "heures" : "heure";
  
  $: minutes = Math.floor((selectedTime - (days * 3600 * 24) - (hours * 3600)) / 60)
  $: minname = minutes > 1 ? "minutes" : "minute";

  $: seconds = Math.floor((selectedTime - (days * 3600 * 24) - (hours * 3600)) - (minutes * 60))

	onMount(() => {
		const interval = setInterval(() => {
            console.log("tick")
			today = dayjs();
		}, 1000);

		return () => {
			clearInterval(interval);
		}
	})
</script>


<div class="container">
  {#if selectedTime > 0}
    {#if resubscription}
      <h1>Les réinscriptions ne sont pas encore ouvertes</h1>
      <div style="font-size:x-large">
        Les réinscriptions ouvriront le <b>{dayjs(resubscriptionDate).format("dddd D MMMM à HH:mm")}</b>.
      </div>
    {:else}
      <h1>Les inscriptions ne sont pas encore ouvertes</h1>
      {#if timeUntilResubscription <0}
        Pour l'instant, seuls les élèves inscrits l'année dernière peuvent se réinscrire.<br><br>
      {/if}
      <div style="font-size:x-large">
        Les inscriptions ouvriront le <b>{dayjs(dateOfNoRestriction).format("dddd D MMMM à HH:mm")}</b>.
      </div>
    {/if}

    <br>
    

    <div class="countdown">
        <ul>
            <li><span>{days}</span>{dayname}</li>
            <li><span>{hours}</span>{hourname}</li>
            <li><span>{minutes}</span>{minname}</li>
            <li><span>{seconds}</span>Secondes</li>
        </ul>
    </div>
    {#if !getAuth().currentUser}
      Pour gagner du temps lors de votre inscription, vous pouvez déjà créer un compte en cliquant sur le lien suivant :
      <a href="/prive?showCreateAccount=true">Créer un compte</a>
    {/if}
  {:else}
    {#if resubscription}
      <h1>Les réinscriptions sont ouvertes !</h1>
      <small>Seuls les élèves inscrits l'année dernière peuvent se réinscrire.</small>
      <br><br>
    {:else}
      <h1>Les inscriptions sont ouvertes !</h1>
    {/if}
    {#if dayUrl}
      <button on:click={$goto("/prive/inscription/[dayUrl]", {dayUrl})}>Cliquez ici pour vous inscrire</button>
    {:else}
      <button on:click={$goto("/")}>Cliquez ici pour choisir votre créneau</button>
    {/if}
  {/if}
 <!--  <br><br><br><br><br><br>
  <small>Voues êtes bénévole au CAF de Faverges ? cliquez ici</small> -->
</div>


<style>

  .container {
  text-align: center;
  }

li {
  display: inline-block;
  font-size: 1.5em;
  list-style-type: none;
  padding: 1em;
  text-transform: uppercase;
  color:var(--primary);
}

li span {
  display: block;
  font-size: 4.5rem;
 
}

@media all and (max-width: 768px) {
  h1 {
    font-size: calc(1.5rem * var(--smaller));
  }
  
  li {
    font-size: calc(1.125rem * var(--smaller));
  }
  
  li span {
    font-size: calc(3.375rem * var(--smaller));
  }
}
  </style>