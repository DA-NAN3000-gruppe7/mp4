# mp4

MILEPÆL 4

Dette er markdown-dokumentet for milepæl 4 i DA-NAN3000. I dette dokumentet spesifiserers hva oppgaven går ut på, hva som er planen/krav, hvordan man bruker systemet og hva som er loggført.



## Oppgave
1. Klienten skal gi brukere samme funksjonalitet som det CGI-baserte web-grensesnittet fra funskjsjonskrav 4. i Milepæl 3.

Tips:

Hvis dere møter på problemer med "same origin policy", kan lønne seg å ta en ekstra titt i boka ( https://learning.oreilly.com/library/view/JavaScript:+The+Definitive+Guide,+7th+Edition/9781491952016/ch15.html#sameoriginpolicy ).

2. Filene som den består av, skal leveres av C-baserte tjeneren fra milepæl Milepæl 1 (Oppdatert [2021-02-01 ma.]) og Milepæl 2.

3. Ved bruk av nettleser som støtter Service workers, skal klienten sette opp en service worker som lagrer alle filene den trenger (HTML, js, css, etc.) og diktene (HTTP-reponsene) i en cache, slik at klientens lese-operasjonener kan fungere "offline" (altså frakoblet fra nettverkene).


## Plan

I denne oppgaven skal en Javascript klient bli skrevet som har så og si samme funksjonalitet som CGI-webgrensensittet fra MP3. Det vil si at den skal gjøre samme API-forespørsler ved utfylling og trykk av knapper.

**Mer kommer....**


## Instruksjoner

Programmet krever følgende:

*	**mp3**-docker container

Mesteparten av repositoriet består av MP2 så framgangen er ganske lik.
Start som vanlig og så gå til localhost/js-client/

**Mer kommer....**

## Log

<pre>
18-04-2021
	MAGNUS: Har så langt lagt evenlisteners til alle knappene som gir riktig forespørsel til REST APIet og gjør da samme utskrift til status-feltet som CGI-webgrensensittet i MP3. I tillegg blir cookies satt slik at sesjoner blir lagret og at man da forblir logget inn selvom man lukker siden og åpner den igjen.

	Jeg modifisert filen conf/httpd.conf på REST API docker containeren til å kunne sende respons til ikke-origin sendere.

		Header set Access-Control-Allow-Origin "http://localhost"
		Header set Access-Control-Allow-Headers "Accept, Content-Type"
		Header set Access-Control-Allow-Credentials "true"
		Header set Access-Control-Allow-Methods "GET, POST, PUT, DELETE"


	Dette kan i teorien bli satt i hvilken som helst blokk, men for sikkerhetskyld er det satt under *directory* blokken.
	Grunnen til dette er for å unngå Same-Origin policien. Det er ikke helt sikkert på hvorfor dette påvirker vårt system siden både REST APIet og webserveren kjører på samme Origin: localhost, men det kan være pga. at de kjører på forskjellige porter.

	For at webserverprogrammet skal kunne lese Javascript filer må en linje i etc/mime.types legges til: 

		text/javascript				js

	En liten endring jeg har gjort som er veldig bruktbart er at jeg har endred *webserver.c* koden til å laste inn *index.html* dersom en katalog er spesifisert i URLen.

	Det gjenstår da bare å få satt opp en service worker.
</pre>
