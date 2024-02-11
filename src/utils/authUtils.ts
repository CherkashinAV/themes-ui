import {RegisterPayload} from '../providers/auth';
import Fingerprint2 from 'fingerprintjs2'
import UAParser from 'ua-parser-js'
import {RegisterForm} from '../types';

export function getRegisterPayload(formData: RegisterForm): RegisterPayload {
	if (formData.code && formData.code !== '') {
		return {
			email: formData.email,
			password: formData.password,
			invitationCode: formData.code
		}
	}

	return {
		email: formData.email,
		password: formData.password,
		name: formData.name,
		surname: formData.surname
	}
}

export const getFingerPrint = async () => {
	const options = {
	  excludes: {
		plugins: true,
		localStorage: true,
		adBlock: true,
		screenResolution: true,
		availableScreenResolution: true,
		enumerateDevices: true,
		pixelRatio: true,
		doNotTrack: true,
	  },
	  preprocessor: (key: any, value: any) => {
		if (key === 'userAgent') {
		  const parser = new UAParser(value);
		  // return customized user agent (without browser version)
		  return `${parser.getOS().name} :: ${parser.getBrowser().name} :: ${
			parser.getEngine().name
		  }`;
		}
		return value;
	  },
	};
  
	try {
	  const components = await Fingerprint2.getPromise(options);
	  const values = components.map(component => component.value);
	  console.log('fingerprint hash components', components);
  
	  return String(Fingerprint2.x64hash128(values.join(''), 31));
	} catch (e) {
	  console.error(e);
	}
};