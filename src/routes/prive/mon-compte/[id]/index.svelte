<script>
    export let context
    import {params} from '@roxi/routify'
    import { getStudent } from '$firestore/getStudent'
    import { printName } from '$utils/printName'
    import { currentSeason } from '$utils/stores'
    import { translate } from '$utils/TRANSLATE'
    import Boolean from '$components/htmlElements/Boolean.svelte'
    import MedicalCertificate from '$components/subscriptionSteps/MedicalCertificate.svelte'
    import HelloAsso from '$components/subscriptionSteps/HelloAsso.svelte'
    import Licence from '$components/subscriptionSteps/Licence.svelte'
    import { doc, onSnapshot } from "firebase/firestore"
    import { db } from "$utils/firebase/firebase"
    import {capitalize} from '$utils/capitalize'
    import { getDayFromUrl } from '$utils/days';
    import ErrorMessage from '$components/htmlElements/ErrorMessage.svelte'
  

    let error
    let urlId = $params.id
    let student
    let fetchingPublic = true
    let fetchingPrivate = true
    $:fetching = fetchingPrivate || fetchingPublic
    const unsub = onSnapshot(doc(db, "students", urlId), async (doc) => {
        try {
            student = await getStudent(urlId)
            if(!student.public.seasons[$currentSeason.name]) throw `Cet élève n'est pas inscrit sur la saison ${$currentSeason.name}`
            let day = getDayFromUrl(student.public.seasons[$currentSeason.name].day, $currentSeason.days)
        } catch (err) {
            error = err
        }
        fetchingPublic = false
    })
    const unsubPrivate = onSnapshot(doc(db, "students", urlId, "privateCol", "privateDoc"), async (doc) => {
        try {
            student = await getStudent(urlId)
        } catch (err) {
            error = err
        }
        fetchingPrivate = false
    })

    // $:if(student && getDayFromUrl(student.public.seasons[$currentSeason.name].day), $currentSeason.days) error = "Une erreur est survenue"
</script>
<!-- change true to false to be able to change season 08/12/23 -->
<ErrorMessage {error} modal={false}/>
{#if student && !fetching}
    {#if student.public.seasons[$currentSeason.name]}
        <article>
                <h1>{printName(student.public)}</h1>
            {#if student.public.seasons[$currentSeason.name].payment==="yes" && student.public.seasons[$currentSeason.name].licence==="yes" && student.public.seasons[$currentSeason.name].medicalCertificate==="yes"}
                <strong style="color:green">L'inscription est terminée !</strong><br>
                <div style="color:green">{capitalize(student.public.firstName)} est bien inscrit·e aux cours d'escalade du CAF de Faverges pour la saison {$currentSeason.name}</div>
                <br><br><br>
            {:else}
                <div>
                    Vous avez jusqu'au <b>{dayjs($currentSeason.deadline).format("dddd D MMMM à HH:mm")}</b> pour finaliser votre inscription.
                    <div style="color:red">Après cette date, votre place sera libérée et proposée aux personnes inscrites sur la liste d'attente.</div>
                </div>
                <br>
                <small>Cliquez sur chaque étape pour plus de détails.</small>
                <br><br>
        
                
                <details>
                    <summary role="button" class="outline"><Boolean value={'yes'} big={true}/>Étape 1 : Créer un compte sur le site de l'école d'escalade</summary>
                    <p style="color:green">Votre compte a bien été créé !</p>
                </details>
                <HelloAsso {student} open={$params.payment}/>
                <MedicalCertificate  {student} open={$params.certificate}/>
                <Licence {student} open={$params.licence}/>
            {/if}
        </article>
    {:else}
        <div style="color:red">Erreur : cet élève n'est pas inscrit sur la saison {$currentSeason.name}</div>
    {/if}
{:else}
        {#if fetching}
            <div aria-busy=true>Merci de patienter...</div>
        {:else}
            <div style="color:red">Erreur : cet élève n'existe pas ou vous n'avez pas les droits pour le voir</div>
        {/if}
{/if}

<slot></slot>
