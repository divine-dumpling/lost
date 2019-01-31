import argparse
import os
import logging
import shutil
import random
import string 

logging.basicConfig(level=logging.INFO, format='(%(levelname)s): %(message)s')

def gen_rand_string(n):
    return ''.join(
        random.SystemRandom().choice(
            string.ascii_uppercase + string.digits
        ) for _ in range(n))

def get_env_config(data_path, release):
    config = [
        ['DEV','True'],
        ['ADD_EXAMPLES','True'],
        ['LOST_VERSION', release],
        ['LOST_FRONTEND_PORT', 80],
        ['LOST_HOME', data_path],
        ['LOST_DB_NAME', 'lost'],
        ['LOST_DB_USER', 'lost'],
        ['LOST_DB_PASSWORD', 'LostDevLost'],
        ['LOST_DB_ROOT_PASSWORD', 'root'],
        ['PROJECT_NAME', 'myProject'],
        ['SECRET_KEY', gen_rand_string(16)],
        ['PIPE_SCHEDULE', '5']
    ]
    return config

def main(args):
    try:
        os.makedirs(args.install_path)
        logging.info('Created: {}'.format(args.install_path))
    except OSError:
        logging.warning('Path already exists: {}'.format(args.install_path))
        return
    dst_data_dir = os.path.join(args.install_path, 'data')
    os.makedirs(dst_data_dir)
    logging.info('Created: {}'.format(dst_data_dir))
    dst_docker_dir = os.path.join(args.install_path, 'docker')
    os.makedirs(dst_docker_dir)
    logging.info('Created: {}'.format(dst_docker_dir))
    example_config_path = '../compose/docker-compose.yml'
    dst_config = os.path.join(dst_docker_dir, 'docker-compose.yml')
    shutil.copy(example_config_path, dst_config)
    logging.info('Copied docker-compose config to: {}'.format(dst_config))
    env_path = os.path.join(dst_docker_dir,'.env')
    with open(env_path, 'a') as f:
        for key, val in get_env_config(dst_data_dir, args.release):
            f.write('{}={}\n'.format(key, val))
    logging.info('Created {}'.format(env_path))
    logging.info('')
    logging.info('Finished setup! To test LOST run:')
    logging.info('cd {} && docker-compose up'.format(dst_docker_dir))
    logging.info('and type localhost into you browser')


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description='Quick setup for lost on linux')
    parser.add_argument('install_path', help='Specify path to install lost.')
    parser.add_argument('release', help='LOST release you want to install.')
    args = parser.parse_args()
    main(args)
