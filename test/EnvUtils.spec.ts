import { isBlank } from '../src/modules/TxtUtils'
import { describe, expect, it } from 'vitest'

describe('TxtUtils', () => {
    it('isBlank', () => {
        expect(isBlank('')).toEqual(true)

    })
})
