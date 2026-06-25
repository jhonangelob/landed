export async function fileToBase64(file: File): Promise<string> {
  const arrayBuffer = await file.arrayBuffer()
  return btoa(
    new Uint8Array(arrayBuffer).reduce(
      (data, byte) => data + String.fromCharCode(byte),
      '',
    ),
  )
}

export const computeMaxBullets = ({
  numExperiences,
  numProjects,
  numEducations,
}: {
  numExperiences: number
  numProjects: number
  numEducations: number
}) => {
  const TOTAL_LIMIT = 786
  const BASE = 230
  const SECTION_COST = 24
  const EXP_COST = 30
  const PROJECT_COST = 16
  const EDU_COST = 30
  const BULLET_COST = 28
  const EXP_WEIGHT = 2
  const PROJECT_WEIGHT = 1

  // Auto-compute section headers based on non-empty sections
  let numSections = 0
  if (numExperiences > 0) numSections += 1
  if (numProjects > 0) numSections += 1
  if (numEducations > 0) numSections += 1

  // Fixed costs (no bullets)
  const fixedCosts =
    BASE +
    numSections * SECTION_COST +
    numExperiences * EXP_COST +
    numProjects * PROJECT_COST +
    numEducations * EDU_COST

  const remaining = TOTAL_LIMIT - fixedCosts
  const maxBullets = Math.floor(remaining / BULLET_COST)

  // Guard: avoid division by zero if no bullets-eligible sections
  const totalWeight = numExperiences * EXP_WEIGHT + numProjects * PROJECT_WEIGHT
  if (totalWeight === 0) {
    return { maxBullets, bulletsPerExperience: 0, bulletsPerProject: 0 }
  }

  // Base weighted distribution
  const bulletsPerWeight = Math.floor(maxBullets / totalWeight)
  const bulletsPerExperience = bulletsPerWeight * EXP_WEIGHT
  const bulletsPerProject = bulletsPerWeight * PROJECT_WEIGHT

  // Distribute leftover bullets to experiences first
  const leftover =
    maxBullets -
    bulletsPerExperience * numExperiences -
    bulletsPerProject * numProjects
  const extraPerExp =
    numExperiences > 0 ? Math.floor(leftover / numExperiences) : 0

  return {
    maxBullets,
    bulletsPerExperience: bulletsPerExperience + extraPerExp,
    bulletsPerProject,
  }
}
