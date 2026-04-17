// Run with: node test-decrypt.js
// Uses the local SDK build from packages/sdk

const formsgPackage = require('./packages/sdk/cjs-entry.cjs')

const formsg = formsgPackage({ mode: 'staging' })

const secretKey = 'gh4zcWMDjIDz62G3T0TCy7KIJTI+fH4gt51z/8eCaKI='

const data = {
  "data": {
    "formId": "6a13b12e17c896c03f823df0",
    "submissionId": "6a13b59d17c896c03f824866",
    "encryptedContent": "Z/5Q5B7jBBiCetDdu9uaoaVgyt23ji5AMLS4Z+zMqkA=;azVQbyW2QA/OrHrg9WTyupNA6697y+Lf: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",
    "encryptedSubmissionSecretKey": "bSURPKZ53eqjtssO3hnXXgXnB/FaFo7k8TadviZyon8=;uyjyJRR6gZnwbNn97TVc4cLhIr9sFeZ8:xbSs/l5o/cALx2AYghxQm88XXhucpwogHIqiQ6XharJ+HriISMtFTJuVMd1Zznvn",
    "version": 3,
    "created": "2026-05-25T02:36:13.475Z",
    "attachmentDownloadUrls": {
      "6a13b56c17c896c03f824790": "https://s3.ap-southeast-1.amazonaws.com/attachments.uat.form.gov.sg/6a13b12e17c896c03f823df0/6734ebf6072e34b452debe89da0a1781f23996af/0823b2948605d6ed916ae44df04d610e5a25264759e21d1a96adbbf2b8a716cf?AWSAccessKeyId=ASIAZPXOW2L4T3UK7HVJ&Expires=1779680173&Signature=LUC3Lxc4VnAZSdqtJ9%2FfKpo5W64%3D&x-amz-security-token=IQoJb3JpZ2luX2VjEJP%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaDmFwLXNvdXRoZWFzdC0xIkcwRQIgI6A2vZaI0UO04I52d1SQTx2lmm3MGahLO72PQC4ctN0CIQD1VgKdjPtgOjGV6VGlydemsDFrJ5ahJnORZklLo53%2F%2Byr4AwhcEAUaDDY1MjI2MTkwNTE0NSIM8jj2pHHGUt9MyjTRKtUD8mwADj85jF5%2FRnz5qSyPny4TSFckw8r0xlh9jcYbpCnHMR%2FPixVGxDvIjRx3yxgiTeEYchHDaM8V%2FN4IUUJEF1E%2BDruyCMW9QYIIx6E5xTZARGO51J4507wL%2B0mU77VOjxq%2FKlR5gTr6pxBZoBqAzMHAQY%2F5lWUB%2F03pPv9rN9IV9WTL4EPNmLC69fUv4qip5FNKS0iyNgV%2FW6QBLGod36giuycYQqARRPRdjsSXCqigL3YYE4%2Fh7Ml816KiR3KtarntAy3GsaMjS10xODX8QT8iROHuIvgHC1hSv1%2FUfTO0HtEAYSmXo%2F%2B2maK0zDF0kuaX6r7lQv0Yd0rNGHy1%2FWSyMwf2ZhS%2BeRwrS1jdP2WjHriG479OpFxKgz4FfGX58ptfxtbF4LWElXvDZY%2FAXqn5BmVCUqbbSDZyOU5esZllqkDv9SWGZJi7FGA7B2VjHCE9V9bXa61pfaoYTEJprKjmP%2F4oqJeZjJqsLA6esWjn47r7OjwBVWv30V%2F6Pjl8RQhVq2FX%2FElVMF8CMVtAH9uCwfEPZfpV7OKDSK1Lds%2FdFE9uT0ni0LkiGlsuCYl3GGgPauiVqAIvNDn5AgoYnrd%2FJP%2Flf%2FuJ4HOHlQZCQLF6tqtz5jCG5s7QBjqlAR9Yr5uLS8hwThBdFrVYtJCUCK6YAlTB7V%2BvF5Bv%2FbzHlG9qsrmtHKbgUtsdeDPvUK51GwgBpPu52WipCE%2FTwg0RgNgRHnoIbl4Uo%2FbkupjvX2H9sXpvStPxCLB9T0DjqyIDoUGqrsaa7gHNTfobW1ZOsvtSbFtD1u9pMk2KtEpXat%2BE%2BEZpc08LkSjMozChk3ww5cVGCHf0iCG253Mnyx976m4Bpw%3D%3D"
    },
    "paymentContent": {},
    "workflowContent": {
      "workflow": [
        {
          "emails": [],
          "_id": "6a13b17a17c896c03f823fb0",
          "workflow_type": "static",
          "edit": [
            "6a13b16017c896c03f823ead",
            "6a13b16217c896c03f823ec1",
            "6a13b13517c896c03f823e25",
            "6a13b14a17c896c03f823e6f",
            "6a13b14f17c896c03f823e7c",
            "6a13b15a17c896c03f823e9b",
            "6a13b15417c896c03f823e8a",
            "6a13b56c17c896c03f824790"
          ]
        },
        {
          "emails": [
            "scott@open.gov.sg"
          ],
          "_id": "6a13b18417c896c03f823fd0",
          "workflow_type": "static",
          "edit": [
            "6a13b14f17c896c03f823e7c",
            "6a13b15a17c896c03f823e9b",
            "6a13b15417c896c03f823e8a"
          ]
        }
      ],
      "workflowStep": 0,
      "submittedSteps": [
        {
          "isApproval": false,
          "submittedAt": "2026-05-25T02:36:13.473Z",
          "nextStepRecipientEmails": [
            "scott@open.gov.sg"
          ],
          "submitterId": "49c5626718c4bb2fa961b58032f100dbef06a898a9ef32fc1949683172ef2ea4"
        }
      ]
    }
  }
}

// Decrypt using form secret key, returns V3 format
const submissionV3 = formsg.cryptoV3.decrypt(secretKey, data.data)
console.log('=== decrypt (V3) ===')
console.log(JSON.stringify(submissionV3, null, 2))

// Decrypt directly using submission secret key (if you have it), returns V3 format
// const submissionFromSubmissionKey = formsg.cryptoV3.decryptFromSubmissionKey('<submissionSecretKey>', data.data)

// Decrypt and adapt to V4 format
// Pass formFields metadata if available; empty object omits question text / myInfo attrs
const submissionV4 = formsg.cryptoV3.decryptToV4(secretKey, data.data, {})
console.log('\n=== decryptToV4 (V4) ===')
console.log(JSON.stringify(submissionV4, null, 2))
