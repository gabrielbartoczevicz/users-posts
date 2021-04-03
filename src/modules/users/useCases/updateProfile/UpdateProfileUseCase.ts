import { Profile } from '.prisma/client';

import { AppError } from '../../../../shared/logic/AppError';
import { IUseCase } from '../../../../shared/modules/IUseCase';
import { IIncomingProfileToUpdateDTO } from '../../dtos/IUpdateProfileDTO';
import { IProfilesRepository } from '../../repositories/IProfilesRepository';
import { IUsersRepository } from '../../repositories/IUsersRepository';

class UpdateProfileUseCase
  implements IUseCase<IIncomingProfileToUpdateDTO, Promise<Profile>> {
  private profilesRepository: IProfilesRepository;

  private usersRepository: IUsersRepository;

  constructor(
    profilesRepository: IProfilesRepository,
    usersRepository: IUsersRepository
  ) {
    this.profilesRepository = profilesRepository;
    this.usersRepository = usersRepository;
  }

  public async execute(
    profileData: IIncomingProfileToUpdateDTO
  ): Promise<Profile> {
    const { userId } = profileData;

    const doesUserExists = await this.usersRepository.findById(userId);

    if (!doesUserExists) {
      throw new AppError(`User #${userId} not found`);
    }

    let toUpdateProfile = await this.profilesRepository.findByUserId(userId);

    if (!toUpdateProfile) {
      throw new AppError(`Profile does not exists for User #${userId}`);
    }

    toUpdateProfile = await this.profilesRepository.save({
      ...profileData,
      id: toUpdateProfile.id,
    });

    return toUpdateProfile;
  }
}

export { UpdateProfileUseCase };