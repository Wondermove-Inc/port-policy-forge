import { IconSearch } from '@tabler/icons-react';
import { Burger, Group, Combobox, useCombobox, InputBase } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { useEffect, useState } from 'react';
import classes from './Topbar.module.css';
import PortPolicyLogo from '../../assets/port-policy-forge-logo.svg'


// const links = [
//     { link: '/about', label: 'Features' },
//     { link: '/pricing', label: 'Pricing' },
//     { link: '/learn', label: 'Learn' },
//     { link: '/community', label: 'Community' },
// ];

// const items = links.map((link) => (
//     <a
//         key={link.label}
//         href={link.link}
//         className={classes.link}
//         onClick={(event) => event.preventDefault()}
//     >
//         {link.label}
//     </a>
// ));

const namespaces = ['default', 'demo', 'kube-system'];

export function Topbar() {
    const [opened, { toggle }] = useDisclosure(false);
    const [selectedNamespace, setSelectedNamespace] = useState<string | null>(null);
    const [search, setSearch] = useState('');

    const combobox = useCombobox({
        onDropdownClose: () => combobox.resetSelectedOption(),
    });

    const shouldFilterOptions = namespaces.every((item) => item !== search);
    const filteredOptions = shouldFilterOptions
        ? namespaces.filter((item) => item.toLowerCase().includes(search.toLowerCase().trim()))
        : namespaces;

    const options = filteredOptions.map((namespace) => (
        <Combobox.Option value={namespace} key={namespace}>
            {namespace}
        </Combobox.Option>
    ));

    return (
        <header className={classes.header}>
            <div className={classes.inner}>
                <Group>
                    <Burger opened={opened} onClick={toggle} size="sm" hiddenFrom="sm" />
                    <img src={PortPolicyLogo} height={60}></img>
                </Group>

                <Group ml={40}>
                    <Combobox
                        store={combobox}
                        onOptionSubmit={(val) => {
                            setSelectedNamespace(val);
                            setSearch(val);
                            combobox.closeDropdown();
                        }}
                    >
                        <Combobox.Target>
                            <InputBase
                                rightSection={<Combobox.Chevron />}
                                rightSectionPointerEvents="none"
                                onClick={() => combobox.openDropdown()}
                                onFocus={() => combobox.openDropdown()}
                                onBlur={() => {
                                    combobox.closeDropdown();
                                    setSearch(selectedNamespace || '');
                                }}
                                placeholder="Search namespace"
                                value={search}
                                onChange={(event) => {
                                    combobox.updateSelectedOptionIndex();
                                    setSearch(event.currentTarget.value);
                                }}
                            />
                        </Combobox.Target>

                        <Combobox.Dropdown>
                            <Combobox.Options>
                                {options.length > 0 ? options : <Combobox.Empty>Nothing found</Combobox.Empty>}
                            </Combobox.Options>
                        </Combobox.Dropdown>
                    </Combobox>
                </Group>


                {/* TODO: Further feature menus will be added here in the future */}
                {/* <Group>
                    <Group ml={50} gap={5} className={classes.links} visibleFrom="sm">
                        {items}
                    </Group>
                    <Autocomplete
                        className={classes.search}
                        placeholder="Search"
                        leftSection={<IconSearch size={16} stroke={1.5} />}
                        data={['React', 'Angular', 'Vue', 'Next.js', 'Riot.js', 'Svelte', 'Blitz.js']}
                        visibleFrom="xs"
                    />
                </Group> */}
            </div>
        </header>
    );
}