<script>
import { printName } from "$utils/printName";


    import { getAge } from "$utils/ageGroups"
    import {translate} from '$utils/TRANSLATE'
    export let student
</script>

<!-- Age -->
{#if student.private.dateOfBirth}
    Âge : <strong>{getAge(student.private.dateOfBirth, false)} ans</strong>
    <small>né(e) le {dayjs(student.private.dateOfBirth).format('DD/MM/YY')}</small> 
    <br>
    {#if student.public.allowed}
    ⚠️
        <span style="color:red">
            Cet élève est autorisé(e) à s'inscrire sur des créneaux non adaptés à son âge.
        </span>
    {:else}
    <span style="color:green">

        Cet élève n'est pas autorisé(e) à s'inscrire sur des créneaux non adaptés à son âge.
    </span>
    {/if}
    <br>
{/if}

<!-- Email -->
{#if student.private.email}
    <br>
    Email perso : 
    <a href="mailto:{student.private.email}" target="_new"><strong>{student.private.email}</strong></a>
    <br>
{/if}

<!-- Phone number -->
{#if student.private.tel}
    Tel perso : 
    <a href="tel:{student.private.tel}"><strong>{student.private.tel}</strong></a>
    <br>
{/if}

<!-- Accident tel -->
{#if student.private.accidentTel}
    Personne à prévenir : 
    <a href="tel:{student.private.accidentTel}"><strong>{student.private.accidentTel}</strong></a>
    <br>
{/if}

<!-- Parents -->
{#if student.private.parents && student.private.parents.length}
    {#each student.private.parents as parent}
        {#if parent.role}
            <br>
            <strong>{translate(parent.role)}</strong><br>
            {printName(parent)}<br>

            <!-- Email -->
            {#if parent.email}
                Email : 
                <a href="mailto:{parent.email}" target="_new"><strong>{parent.email}</strong></a>
                <br>
            {/if}
            <!-- Phone number -->
            {#if parent.tel}
                Tel : 
                <a href="tel:{parent.tel}"><strong>{parent.tel}</strong></a>
                <br>
            {/if}
        {/if}
    {/each}
    <br>
{/if}

<!-- Certif -->
Certificat médical :
{#if student.private.medicalCertificateLink}
    <a href={student.private.medicalCertificateLink} target="_new">Cliquez ici pour voir le certificat</a><br>
    {#if student.private.medicalCertificateTimestamp}
        <small>Transféré le {student.private.medicalCertificateTimestamp}</small>
    {/if}

{:else}
    <span style="color:red">Pas de cetificat</span>
{/if}