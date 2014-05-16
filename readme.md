# [topcoder] Search API

This is running against live, production data in Elasticsearch coming from the API. A task runs every 10 minutes that calls the [topcoder API](http://docs.tcapi.apiary.io/) and loads development and design challenges into Elasticsearch.

By default, all challenge type data is searchable together unless you specify otherwise. For instance, if you [search for "IDOL"](http://localhost:9393/challenges/search?q=IDOL) it will return all design and development challenges with the keyword "IDOL" anywhere in the challenge. If you want to only search specific types of challenges you can do so (see bottom of page) and return results for the specified type of challenge.

Essentially you can search by almost any key in the JSON document by substituting it below in the query param. The values for the query parameter (q) must be encoded.

## Simple Searches

1. [/challenges/search?q=assembly](/challenges/search?q=assembly) - Keyword search across all fields (anywhere!) in the challenge
2. [/challenges/search?q=challengeName:IDOL](/challenges/search?q=challengeName:IDOL) - Keyword search in challenge name
3. [/challenges/search?q=challengeName:TCO*](/challenges/search?q=challengeName:TCO*) - Keyword search with wildcards(*)
4. [/challenges/search?q=challengeId:30042021](/challenges/search?q=challengeId:30042021) - Return challenge by ID
5. [/challenges/search?q=challengeType:First2Finish](/challenges/search?q=challengeType:First2Finish) - Return all "First2Finish' challenges
6. [/challenges/search?q=technologies:javascript](/challenges/search?q=technologies:javascript) - Search for all challenges with 'Javascript' as one of the platforms
7. [/challenges/search?q=technologies:Apex,HTML](/challenges/search?q=technologies:Apex,HTML) - Search for all challenges with 'Apex' and 'HTML' as one of the technologies
8. [/challenges/search?q=numSubmissions:>20](/challenges/search?q=numSubmissions:>20) - Search for all challenges with more than 20 submissions
9. [/challenges/search?q=currentStatus:Active](/challenges/search?q=currentStatus:Active) - Return all active challenges
10. [/challenges/search?q=submissionEndDate%3A%3E2014%2F05%2F01](/challenges/search?q=submissionEndDate%3A%3E2014%2F05%2F01) - All challenges with the submission end date later than May 1, 2014 (e.g., q=submissionEndDate:>2014/05/01)

## Complex Searches

If you want to search by more than one parameter, make sure you encode the q parameter. See [this Elasticsearch help page](http://www.elasticsearch.org/guide/en/elasticsearch/reference/current//query-dsl-query-string-query.html#query-string-syntax) for more information about complex query strings.

1. [/challenges/search?q=challengeName%3AIDOL%20-currentStatus%3ACompleted](/challenges/search?q=challengeName%3AIDOL%20-currentStatus%3ACompleted) - All challenges with "IDOL" in the challenge name that are not 'Completed' status (e.g, q=challengeName:IDOL -currentStatus:Completed)
2. [/challenges/search?q=challengeType%3DAssembly%20platforms%3AHTML%20-technologies%3APHP](/challenges/search?q=challengeType%3DAssembly%20platforms%3AHTML%20-technologies%3APHP) - All 'Assembly" challenge type for HTML platform but **not** PHP technology (e.g, q=challengeType=Assembly platforms:HTML -technologies:PHP)
3. [/challenges/search?q=challengeType%3Acode%20numRegistrants%3A>20](/challenges/search?q=challengeType%3Acode%20numRegistrants%3A>20) - All 'code' challenges with more than 20 registrants (e.g, q=challengeType:code numRegistrants:>20)
3. [/challenges/search?q=challengeType%3Acode%20numRegistrants%3A>20](/challenges/search?q=challengeType%3Acode%20numRegistrants%3A>20) - All 'code' challenges with 5-10 registrants (e.g, q=challengeType:code numRegistrants:>20)

## Searching by Specific Challenge Type

Virtually all of the above API calls work when specifying the type of challenge to return:

1. [/challenges/search?q=challengeName:IDOL](/challenges/search?q=challengeName:IDOL) - Returns **any** challenge with "IDOL" in the challenge name
2. [/challenges/design/search?q=challengeName:IDOL](/challenges/design/search?q=challengeName:IDOL) - Returns **design** challenges with "IDOL" in the challenge name
3. [/challenges/development/search?q=challengeName:IDOL](/challenges/development/search?q=challengeName:IDOL) - Returns **development** challenges with "IDOL" in the challenge name


