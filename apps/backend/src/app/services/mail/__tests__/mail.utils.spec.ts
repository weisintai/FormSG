import { ObjectId } from 'bson'
import { BasicField } from 'formsg-shared/types'
import { SIGNATURE_CAPTURED_STRING } from 'formsg-shared/utils/signature'

import * as ConvertHtmlToPdf from '../../../utils/convert-html-to-pdf'
import {
  buildResponseJson,
  generateAutoreplyPdf,
  safeRenderFileForTest,
} from '../mail.utils'

jest.mock('../../../utils/convert-html-to-pdf.ts')
const MockConvertHtmlToPdf = jest.mocked(ConvertHtmlToPdf)

const MOCK_PDF_BUFFER = Buffer.from('mock pdf buffer')
const MOCK_SUBMISSION_DATE_TIME = new Date('2025-01-01T00:00:00.000Z')

describe('mail.utils', () => {
  const AUTOREPLY_PDF_TEMPLATE_FILEPATH = `${__dirname}/../../../views/templates/submit-form-summary-pdf.server.view.html`
  beforeEach(() => {
    jest.clearAllMocks()
    MockConvertHtmlToPdf.generatePdfFromHtml.mockResolvedValue(MOCK_PDF_BUFFER)
  })

  describe('generateAutoreplyPdf', () => {
    it('should generate a pdf from html', async () => {
      // Arrange
      const mockFormId = new ObjectId().toHexString()
      const mockSubmissionId = new ObjectId().toHexString()
      const autoReplyData = {
        refNo: mockSubmissionId,
        formTitle: 'Test Form',
        submissionDateTime: MOCK_SUBMISSION_DATE_TIME,
        responsesData: [],
        formUrl: `https://form.gov.sg/${mockFormId}`,
      }

      // Act
      const result = await generateAutoreplyPdf(autoReplyData)

      // Assert
      expect(MockConvertHtmlToPdf.generatePdfFromHtml).toHaveBeenCalledOnce()
      expect(result._unsafeUnwrap()).toEqual(MOCK_PDF_BUFFER)
    })

    it('should generate pdfRender data correctly for signature field', async () => {
      // Arrange
      const mockFormId = new ObjectId().toHexString()
      const mockSubmissionId = new ObjectId().toHexString()
      const MOCK_SIGNATURE_PNG_DATAURI = 'datauri://signature.png'
      const autoReplyData = {
        refNo: mockSubmissionId,
        formTitle: 'Test Form',
        submissionDateTime: MOCK_SUBMISSION_DATE_TIME,
        responsesData: [
          {
            question: 'Signature',
            answer: MOCK_SIGNATURE_PNG_DATAURI,
            answerTemplate: [SIGNATURE_CAPTURED_STRING],
            fieldType: BasicField.Signature,
          },
        ],
        formUrl: `https://form.gov.sg/${mockFormId}`,
      }

      const formattedSubmissionTimeString = 'Wed, 01 Jan 2025 08:00:00 AM'

      const pdfRenderData = {
        refNo: mockSubmissionId,
        formTitle: 'Test Form',
        submissionTime: formattedSubmissionTimeString,
        formData: [
          {
            question: 'Signature',
            answer: MOCK_SIGNATURE_PNG_DATAURI, // should be defined for signature fields
            answerTemplate: [SIGNATURE_CAPTURED_STRING],
          },
        ],
        formUrl: `https://form.gov.sg/${mockFormId}`,
      }

      const expectedHtml = await safeRenderFileForTest(
        AUTOREPLY_PDF_TEMPLATE_FILEPATH,
        pdfRenderData,
      )

      // Act
      const result = await generateAutoreplyPdf(autoReplyData)

      // Assert
      expect(MockConvertHtmlToPdf.generatePdfFromHtml).toHaveBeenCalledOnce()
      expect(MockConvertHtmlToPdf.generatePdfFromHtml).toHaveBeenCalledWith(
        expectedHtml._unsafeUnwrap(),
      )
      expect(result._unsafeUnwrap()).toEqual(MOCK_PDF_BUFFER)
    })

    it('should generate pdfRender data correctly for non-signature fields', async () => {
      // Arrange
      const mockFormId = new ObjectId().toHexString()
      const mockSubmissionId = new ObjectId().toHexString()
      const autoReplyData = {
        refNo: mockSubmissionId,
        formTitle: 'Test Form',
        submissionDateTime: MOCK_SUBMISSION_DATE_TIME,
        responsesData: [
          {
            question: 'Table field',
            answer: 'Table answer',
            answerTemplate: ['Table answer'],
            fieldType: BasicField.Table,
          },
        ],
        formUrl: `https://form.gov.sg/${mockFormId}`,
      }

      const formattedSubmissionTimeString = 'Wed, 01 Jan 2025 08:00:00 AM'

      const pdfRenderData = {
        refNo: mockSubmissionId,
        formTitle: 'Test Form',
        submissionTime: formattedSubmissionTimeString,
        formData: [
          {
            question: 'Table field',
            answer: undefined, // should be undefined for non-signature fields
            answerTemplate: ['Table answer'],
          },
        ],
        formUrl: `https://form.gov.sg/${mockFormId}`,
      }
      const expectedHtml = await safeRenderFileForTest(
        AUTOREPLY_PDF_TEMPLATE_FILEPATH,
        pdfRenderData,
      )

      // Act
      const result = await generateAutoreplyPdf(autoReplyData)

      // Assert
      expect(MockConvertHtmlToPdf.generatePdfFromHtml).toHaveBeenCalledOnce()
      expect(MockConvertHtmlToPdf.generatePdfFromHtml).toHaveBeenCalledWith(
        expectedHtml._unsafeUnwrap(),
      )
      expect(result._unsafeUnwrap()).toEqual(MOCK_PDF_BUFFER)
    })
  })

  describe('buildResponseJson', () => {
    it('should prepend Response ID and Timestamp as first two entries', () => {
      const result = JSON.parse(buildResponseJson('abc123', '1 Jan 2025', []))
      expect(result[0]).toEqual({ question: 'Response ID', answer: 'abc123' })
      expect(result[1]).toEqual({ question: 'Timestamp', answer: '1 Jan 2025' })
    })

    it('should include question and answer from form responses', () => {
      const result = JSON.parse(
        buildResponseJson('abc123', '1 Jan 2025', [
          {
            question: 'Name',
            answer: 'Alice',
            fieldType: BasicField.ShortText,
          },
        ]),
      )
      expect(result[2]).toEqual({ question: 'Name', answer: 'Alice' })
    })

    it('should strip [verified] prefix from question titles', () => {
      const result = JSON.parse(
        buildResponseJson('abc123', '1 Jan 2025', [
          {
            question: '[verified] Email',
            answer: 'alice@example.com',
            fieldType: BasicField.Email,
          },
        ]),
      )
      expect(result[2].question).toBe('Email')
    })

    it('should exclude non-response fields (Section, Statement, Image)', () => {
      const result = JSON.parse(
        buildResponseJson('abc123', '1 Jan 2025', [
          {
            question: 'Section Header',
            answer: '',
            fieldType: BasicField.Section,
          },
          {
            question: 'Statement',
            answer: '',
            fieldType: BasicField.Statement,
          },
          { question: 'Image', answer: '', fieldType: BasicField.Image },
          {
            question: 'Name',
            answer: 'Alice',
            fieldType: BasicField.ShortText,
          },
        ]),
      )
      expect(result).toHaveLength(3) // Response ID + Timestamp + Name
      expect(result[2]).toEqual({ question: 'Name', answer: 'Alice' })
    })

    it('should strip fieldType and other internal fields from output', () => {
      const result = JSON.parse(
        buildResponseJson('abc123', '1 Jan 2025', [
          {
            question: 'Name',
            answer: 'Alice',
            fieldType: BasicField.ShortText,
          },
        ]),
      )
      expect(result[2]).not.toHaveProperty('fieldType')
    })
  })
})
